import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCcdwdHYYtQHBu1sh5vVN4JtR-wWrdLgPA",
  authDomain: "test-fa09e.firebaseapp.com",
  projectId: "test-fa09e"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

export default db;
