import * as firebase from "firebase";
import React from "react"

const firebaseConfig = {
  apiKey: "AIzaSyDvFcrd-owxZVH9B0PL-VOV6Nj3dfBoaXY",
  authDomain: "mykanban-ca309.firebaseapp.com",
  databaseURL: "https://mykanban-ca309.firebaseio.com",
  projectId: "mykanban-ca309",
  storageBucket: "mykanban-ca309.appspot.com",
  messagingSenderId: "591706272817",
  appId: "1:591706272817:web:3abb4bea6a283b8d3bd110"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
let taskToAdd={id: "74" , title: "Inhaltstypen verhauen", posX: 650, posY: 190, developer: "Dr. Sharepoint", devGroup: "group_sharepoint", dod: (<ul><li>Super cooles Design</li><li>Krasse Funktionen mit guter Performance</li><li>Es kann zwischen Darkmode und normalem Design gewechselt werden</li></ul>) }


db.collection("tasks").add(taskToAdd)
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  })

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();