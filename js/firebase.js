import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js'
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAyJ52zXtuoMBziMgWUL6NLb8JAYWjQIas",
    authDomain: "oddsflip.firebaseapp.com",
    databaseURL: "https://oddsflip-default-rtdb.firebaseio.com",
    projectId: "oddsflip",
    storageBucket: "oddsflip.appspot.com",
    messagingSenderId: "120188926499",
    appId: "1:120188926499:web:43ce756aab69c1d57c0f96",
    measurementId: "G-H5XGNSVPDE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const testRef = ref(db);
onValue(starCountRef, (snapshot) => {
  console.log(snapshot.val());
});