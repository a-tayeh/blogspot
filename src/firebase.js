import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBUA5y_DIOnp6G3GCNqx6STq4QFyUi0juM",
  authDomain: "brightspot-blog.firebaseapp.com",
  projectId: "brightspot-blog",
  storageBucket: "brightspot-blog.appspot.com",
  messagingSenderId: "563541066762",
  appId: "1:563541066762:web:b8e5e0ff094e9613130bf3",
  measurementId: "G-BH0HV5JKYR",
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;
