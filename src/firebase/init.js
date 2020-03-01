import firebase from 'firebase'
  
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB-C5c2OzV3Q2XR698voWrpzMRSQ82nMFE",
  authDomain: "app-geo-ninjas.firebaseapp.com",
  databaseURL: "https://app-geo-ninjas.firebaseio.com",
  projectId: "app-geo-ninjas",
  storageBucket: "app-geo-ninjas.appspot.com",
  messagingSenderId: "554509129827",
  appId: "1:554509129827:web:e19bedbe2dca40d801c056"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore()