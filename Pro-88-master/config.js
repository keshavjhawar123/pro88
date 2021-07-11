import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyDgWRpZuahnpbnFcLvMXSzex8MWyJNzj2A",
    authDomain: "barterapp-ad210.firebaseapp.com",
    projectId: "barterapp-ad210",
    storageBucket: "barterapp-ad210.appspot.com",
    messagingSenderId: "929684679157",
    appId: "1:929684679157:web:dfecb88fa428078d7b58bc"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();