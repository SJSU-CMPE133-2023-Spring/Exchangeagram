import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from '../constants/index'
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

//-----------------------------------------------------------------------------------------------------------------------------
// export function fetchUserFollowing() { // DONT USE THIS ITS A TEMPLATE
//   return ((dispatch) => {
//     firebase.firestore()
//       .collection("following")
//       .doc(firebase.auth().currentUser.uid)
//       .collection("userFollowing")
//       .onSnapshot((snapshot) => {
//         let following = snapshot.docs.map(doc => {
//           const id = doc.id;
//           return id
//         })
//         dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following})
//         for (let i = 0; i < following.length; i++){
//           dispatch(fetchUsersData(following[i]));
//         }
//       })
//   })
// }

export function fetchUserFollowing() { // WORKING VERSION
  return (dispatch) => {
    const db = getFirestore();
    const auth = getAuth();
    const currentUserUid = auth.currentUser.uid;

    onSnapshot(
      collection(doc(db, 'following', currentUserUid),'userFollowing'),
      (snapshot) => {
        const following = snapshot.docs.map((doc) => doc.id);
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++){
          dispatch(fetchUsersData(following[i]));
        }
      }
    );
  };
}
//-----------------------------------------------------------------------------------------------------------------------------
// export function fetchUsersData(uid) { // DONT USE THIS ITS A TEMPLATE
//   return((dispatch, getState) => {
//     const found = getState().usersState.users.some(el => el.uid === uid);

//     if(!found) {
//       firebase.firestore()
//         .collection("users")
//         .doc(uid)
//         .get()
//         .then((snapshot) => {
//           if (snapshot.exists) {
//             let user = snapshot.data();
//             user.uid = snapshot.id;

//             dispatch({ type: USERS_DATA_STATE_CHANGE, user });
//             dispatch(fetchUsersFollowingPosts(user.id));
//           }
//           else {
//             console.log('does not exist')
//           }
//         })
//     }
//   })
// }

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

          dispatch({ type: USERS_DATA_STATE_CHANGE, user });
          dispatch(fetchUsersFollowingPosts(user.id));
        } else {
          console.log('does not exist');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
}
//-----------------------------------------------------------------------------------------------------------------------------
export function fetchUsersFollowingPosts(uid) { // DONT USE THIS ITS A TEMPLATE
  return ((dispatch, getState) => {
    firebase.firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        console.log({snapshot, uid});
        const user = getState().usersState.users.find(el => el.uid === uid);

        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data, user}
        })
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid})
      })
  })
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
        return { id, ...data, user };
      });

      dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid: fetchedUid });
    } catch (error) {
      console.log(error);
    }
  };
}