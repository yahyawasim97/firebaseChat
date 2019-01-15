import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyAxIYAYRx0DD88t_3yNU8CLEfM8OLA16Yo",
    authDomain: "chatapp-a5f3f.firebaseapp.com",
    databaseURL: "https://chatapp-a5f3f.firebaseio.com",
    projectId: "chatapp-a5f3f",
    storageBucket: "chatapp-a5f3f.appspot.com",
    messagingSenderId: "1062264737592"
  };
firebase.initializeApp(config);

export default firebase;