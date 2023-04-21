import { USER_STATE_CHANGE } from '../constants/index'
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
  };
}