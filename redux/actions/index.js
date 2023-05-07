import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
import { getFirestore, collection, doc, getDocs, query, orderBy, getDoc, onSnapshot } from 'firebase/firestore';
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
        const creation = data.creation.toMillis();
        return { id, ...data, creation };
      });
      dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };
};

export function fetchUserFollowing() { // WORKING FULLY
  return (dispatch) => {
    const db = getFirestore();
    const auth = getAuth();
    const currentUserUid = auth.currentUser.uid;

    onSnapshot(
      collection(db, 'following', currentUserUid, 'userFollowing'),
      (snapshot) => {
        // We create an array to store the following users.
        const following = snapshot.docs.map((doc) => doc.id);
        
        // Dispatch an action to update the state with the new following users.
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        
        // For each following user, fetch their data and dispatch another action to update the state.
        following.forEach((uid) => {
          dispatch(fetchUsersData(uid));
        });
      }
    );
  };
}

export function fetchUsersData(uid) {
  return async (dispatch, getState) => {
    const found = getState().usersState.users.some(el => el.uid === uid);

    if (!found) {
      const db = getFirestore();
      const userRef = doc(db, "users", uid);

      try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const user = userDoc.data();
          user.uid = userDoc.id;

          // Dispatch an action to update the state with the user data.
          dispatch({ type: USERS_DATA_STATE_CHANGE, user });
          
          // Fetch the user's following posts and update the state.
          dispatch(fetchUsersFollowingPosts(user.uid));
        } else {
          console.log('User does not exist');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return async (dispatch, getState) => {
    try {
      const db = getFirestore();
      const userPostsRef = collection(doc(db, 'posts', uid), 'userPosts');
      const postsQuery = query(userPostsRef, orderBy('creation', 'asc'));

      const snapshot = await getDocs(postsQuery);
      const fetchedUid = uid;

      console.log({ snapshot, fetchedUid });
      
      const user = getState().usersState.users.find(el => el.uid === fetchedUid);

      const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        // Convert the creation field to a timestamp (in milliseconds)
        const creation = data.creation.toMillis();
        return { id, ...data, creation, user };
      });

      dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid: fetchedUid });
    } catch (error) {
      console.log(error);
    }
  };
}

export function clearData() {
  return ((dispatch) => {
    dispatch({type: CLEAR_DATA})
  })
}