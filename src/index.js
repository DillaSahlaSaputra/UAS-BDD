import { initializeApp } from "firebase/app";
import {
    getFirestore,collection,getDocs,
    addDoc,deleteDoc,doc,onSnapshot,
    query,where,
    orderBy,serverTimestamp,
    getDoc,updateDoc
}from "firebase/firestore"

import{
    getAuth,
    createUserWithEmailAndPassword,
    signOut,signInWithEmailAndPassword,
    onAuthStateChanged
}from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAfe2FWBgJQ40UtaEhfj33b8o2fpNyd8J0",
    authDomain: "uasbdd.firebaseapp.com",
    projectId: "uasbdd",
    storageBucket: "uasbdd.appspot.com",
    messagingSenderId: "833577113106",
    appId: "1:833577113106:web:5ca70f5eb8508141152acb"
  };
  //init firebase app
  initializeApp(firebaseConfig)

  //init services
  const db = getFirestore()
  const auth = getAuth()
  //collection ref
  const colRef = collection(db,'Buku')

  //queries
    const q = query(colRef,orderBy('createdAt'))

  //Realtime collection data  
    const unsubCol = onSnapshot(q,(snapshot)=>{
        let Buku = []
        snapshot.docs.forEach((doc)=> {
            Buku.push({ ...doc.data(), id:doc.id })
        })
        console.log(Buku)
    })

//Add document
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(colRef,{
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(()=> {
        addBookForm.reset()
    })
})

//Delete document
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'Buku', deleteBookForm.id.value)
    deleteDoc(docRef)
    .then(() =>{
        deleteBookForm.reset()
    })
})

//Get Single Document
const docRef = doc(db, 'Buku','dVKkYIYBIfdwY67VoXtE')

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(),doc.id)
})

//Updates Books
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'Buku', updateForm.id.value)
    updateDoc(docRef,{
        title:'Tersenyum itu Indah'
    })
    .then(() => {
        updateForm.reset()
    })
});

//SignUp User
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth,email,password)
    .then((cred) => {
        console.log('User Created :', cred.user)
        signupForm.reset()
    })
    .catch((err)=> {
        console.log(err.message)
    })
})

//Logout User
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
   signOut(auth)
    .then(()=> {
       //console.log('User Signed out')
    })
    .catch((err)=> {
        console.log(err.message)
    })
})
//Login User
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth,email,password)
    .then((cred) =>{
        //console.log('user logged in:', cred.user)
})
.catch((err)=> {
    console.log(err.message)
    })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth,(user) => {
    console.log('User Status Changed:',user)
})

//unsubscribing
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', (e) => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})