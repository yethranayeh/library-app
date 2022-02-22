/** @format */

import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { GoogleAuthProvider, OAuthCredential, signInWithPopup, signOut } from "firebase/auth";
import { db, auth } from "./Firebase-config";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import AlertObj from "./interface/AlertObj";
import Alert from "./Alert";
import Home from "./Home";
import Book from "./interface/Book";
import AddBooks from "./AddBooks";

const devBaseName = "";
// const prodBaseName = "/library-app";

function useDelayUnmount(isMounted: boolean, delayTime: number) {
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		let timeoutId: any;
		if (isMounted && !shouldRender) {
			setShouldRender(true);
		} else if (!isMounted && shouldRender) {
			timeoutId = setTimeout(() => setShouldRender(false), delayTime);
		}
		return () => clearTimeout(timeoutId);
	}, [isMounted, delayTime, shouldRender]);
	return shouldRender;
}

export default function App() {
	// Main states
	const [books, setBooks] = useState([] as Book[]);
	const [tableLoading, setTableLoading] = useState(true);
	const [user, setUser] = useState(null as object | null);

	const booksCollectionRef = collection(db, "books");

	// Alert
	const [alert, setAlert] = useState({
		type: "",
		title: "",
		description: ""
	});
	const [alertLoading, setAlertLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const shouldRenderAlert = useDelayUnmount(showAlert, 500);
	const alertBeginTimer = () => setTimeout(() => setShowAlert(false), 2500);
	const alertMountedStyle = { animation: "inAnimation 500ms ease-in" };
	const alertUnmountedStyle = { animation: "outAnimation 500ms ease-in" };

	useEffect(() => {
		let isSubscribed = true;
		fetchBooks().then((books) => {
			if (isSubscribed) {
				setBooks(books);
				setTableLoading(false);
			}
		});
		return () => {
			isSubscribed = false;
		};
	}, []);

	async function signInWithGoogle() {
		setShowAlert(true);
		setAlertLoading(true);

		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = (credential as OAuthCredential).accessToken;
			// The signed-in user info.
			const user = result.user;
			setUser(user);
			setAlert({
				type: "success",
				title: `Welcome ${user.displayName}!`,
				description: "You have successfully signed in."
			});
		} catch (error: any) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			setAlert({
				type: "error",
				title: `Error: ${errorCode}`,
				description: errorMessage + "\nLogged in as: " + email
			});
		} finally {
			setAlertLoading(false);
			alertBeginTimer();
		}
	}

	async function userSignOut() {
		setShowAlert(true);
		setAlertLoading(true);

		try {
			await signOut(auth);
			setUser(null);
			setAlert({
				type: "success",
				title: "Success",
				description: "You have successfully signed out."
			});
		} catch (error: any) {
			setAlert({
				type: "error",
				title: "Error",
				description: error.message
			});
		} finally {
			setAlertLoading(false);
			alertBeginTimer();
		}
	}

	async function addBook(book: Book) {
		setShowAlert(true);
		setAlertLoading(true);
		try {
			await addDoc(booksCollectionRef, book);
			const updatedBooks = await fetchBooks();
			setBooks(updatedBooks);
			setAlert({
				type: "success",
				title: "Success",
				description: "Book added successfully"
			});
		} catch (e) {
			console.error("Error adding document: ", e);
			setAlert({
				type: "error",
				title: "Error!",
				description: "Book could not be added."
			});
		} finally {
			setAlertLoading(false);
			alertBeginTimer();
		}
	}

	async function fetchBooks() {
		try {
			const data = await getDocs(booksCollectionRef);
			const books = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			setAlert({
				type: "success",
				title: "Success",
				description: "Books fetched successfully"
			});

			return books as Book[];
		} catch (e) {
			console.error("Error getting documents: ", e);
			setAlert({
				type: "error",
				title: "Error!",
				description: "Books could not be fetched."
			});
			return [];
		}
	}

	async function updateBookRead(id: string, read: boolean) {
		setShowAlert(true);
		setAlertLoading(true);
		try {
			const bookDoc = doc(db, "books", id);
			await updateDoc(bookDoc, { read: read });
			const updatedBooks = await fetchBooks();
			setBooks(updatedBooks);
			setAlert({
				type: "success",
				title: "Success",
				description: "Book updated successfully"
			});
		} catch (e) {
			console.error("Error updating document: ", e);
			setAlert({
				type: "error",
				title: "Error!",
				description: "Book could not be updated."
			});
		} finally {
			setAlertLoading(false);
			alertBeginTimer();
		}
	}

	async function removeBook(book: Book) {
		setShowAlert(true);
		setAlertLoading(true);
		const bookRef = doc(db, `books/${book.id}`);

		try {
			await deleteDoc(bookRef);
			const books = await fetchBooks();
			setBooks(books);

			setAlert({
				type: "success",
				title: "Success",
				description: "Book removed successfully"
			});
		} catch (e) {
			console.error("Error removing document: ", e);
			setAlert({
				type: "error",
				title: "Error!",
				description: "Book could not be removed."
			});
		} finally {
			setAlertLoading(false);
			alertBeginTimer();
		}
	}

	function submitHandler(event: Event) {
		event.preventDefault();

		const bookName = (document.getElementById("bookName") as HTMLInputElement).value;
		const authorName = (document.querySelector("#authorName") as HTMLInputElement).value;
		const pagesInput = (document.querySelector("#pagesInput") as HTMLInputElement).value;
		const readInput = (document.querySelector("#readInput") as HTMLInputElement).checked;
		const newBook = {
			name: bookName,
			author: authorName,
			pages: Number(pagesInput),
			read: readInput
		};

		addBook(newBook);
	}

	return (
		<BrowserRouter basename={devBaseName}>
			<Navbar user={user} login={signInWithGoogle} logout={userSignOut} />
			<Routes>
				<Route
					path='/'
					element={
						<Home
							loading={tableLoading}
							books={books}
							removeBookHandler={removeBook}
							updateBookHandler={updateBookRead}
						/>
					}
				/>
				<Route path='/add-books' element={<AddBooks submitHandler={submitHandler} />} />
			</Routes>
			{shouldRenderAlert && (
				<Alert
					style={showAlert ? alertMountedStyle : alertUnmountedStyle}
					loading={alertLoading}
					alert={alert as AlertObj}
				/>
			)}
		</BrowserRouter>
	);
}
