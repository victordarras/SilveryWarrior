import data from "./data/db.json";
import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCcdwdHYYtQHBu1sh5vVN4JtR-wWrdLgPA",
  authDomain: "test-fa09e.firebaseapp.com",
  projectId: "test-fa09e"
};
firebase.initializeApp(firebaseConfig);
var db = firebase;

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docTitle => {
            db.firestore()
                .collection(key)
                .doc(docTitle)
                .set(nestedContent[docTitle])
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});
