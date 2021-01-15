import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyABTsZYuGV-VxYnJA3rwBKhQAVbJAaixh4",
    authDomain: "glokool-a7604.firebaseapp.com",
    databaseURL: "https://glokool-a7604-default-rtdb.firebaseio.com",
    projectId: "glokool-a7604",
    storageBucket: "glokool-a7604.appspot.com",
    messagingSenderId: "603637824492",
    appId: "1:603637824492:web:d86fc8e9b5206433ba9ec9",
    measurementId: "G-H2FCWDMJPN"
}


firebase.initializeApp(firebaseConfig); // 연동 시작

export const auth = firebase.auth; 
export const firestore = firebase.firestore();
export const database = firebase.database();

export function signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});
    return auth().signInWithPopup(provider);
}


export default firebase;
