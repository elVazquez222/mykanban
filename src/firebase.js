import firebase from "firebase/app"
import "firebase/firestore"

 // Your web app's Firebase configuration 
 var firebaseConfig = { 
  apiKey: "AIzaSyCJ40uZWVKbIALUb4jJlftmDLjMi-vtgEM", 
  authDomain: "mykanban-1510f.firebaseapp.com", 
  databaseURL: "https://mykanban-1510f.firebaseio.com", 
  projectId: "mykanban-1510f", 
  storageBucket: "mykanban-1510f.appspot.com", 
  messagingSenderId: "366435230539", 
  appId: "1:366435230539:web:8ba0bf365d58cea5643ece", 
  measurementId: "G-4KG9LWKYYV" 
}; 
// Initialize Firebase 
firebase.initializeApp(firebaseConfig); 

export default firebase