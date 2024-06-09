require('dotenv').config()
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import 'firebase/compat/storage';


// console.log('TEST :'+process.env.STORAGEBUCKET);

firebase.initializeApp({
    apiKey: process.env.KEY,
    authDomain: process.env.DOMAINE,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID
});
const storage = firebase.storage();
export { storage };
