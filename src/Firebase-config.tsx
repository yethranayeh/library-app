/** @format */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBjoLymaZ4_DgNER8xWw9BdfCmznGykwfs",
	authDomain: "library-project-b01ca.firebaseapp.com",
	projectId: "library-project-b01ca",
	storageBucket: "library-project-b01ca.appspot.com",
	messagingSenderId: "763771273207",
	appId: "1:763771273207:web:2b0de8a26cb12a2225b8f2"
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
