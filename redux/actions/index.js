import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from '../constants/index'
import { getFirestore, collection, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


export function fetchUser() {
  return (dispatch) => {
    const db = getFirestore();
    const auth = getAuth();
    const currentUserUid = auth.currentUser.uid;

    getDoc(doc(db, "users", currentUserUid)).then((snapshot) => {
      if (snapshot.exists()) {
        dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
      }
      else{
        console.log('does not exist ')
      }
    });
  }
}

export function fetchUserPosts() {
  return async (dispatch) => {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const currentUserUid = auth.currentUser.uid;

      const q = query(
        collection(
          doc(collection(db, 'posts'), currentUserUid),
          'userPosts'
        ),
        orderBy('creation', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        // Convert the 'creation' field to a Unix timestamp
        const creation = data.creation.toMillis();
        return { id, ...data, creation };
      });
      dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };
};