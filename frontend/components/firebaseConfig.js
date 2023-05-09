import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyC63abKl535Hdz0gHccQ9qAFF-bHxWamOw",
    authDomain: "exchangeagram-b6617.firebaseapp.com",
    projectId: "exchangeagram-b6617",
    storageBucket: "exchangeagram-b6617.appspot.com",
    messagingSenderId: "17035677494",
    appId: "1:17035677494:web:1690c2231be362112a6d97",
    measurementId: "G-3Q716G2L8Q"
  };

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
