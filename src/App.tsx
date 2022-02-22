/** @format */

import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./Firebase-config";
import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import AlertObj from "./interface/AlertObj";
import Alert from "./Alert";
import Home from "./Home";
import Book from "./interface/Book";
import AddBooks from "./AddBooks";

// const devBaseName = "";
const prodBaseName = "/library-app";

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
	const [booksCollectionRef, setBooksCollectionRef] = useState(collection(db, "temp"));
	const [booksUserRef, setbooksUserRef] = useState("temp");

	// Alert
	const [alert, setAlert] = useState({
		type: "",
		title: "",
		description: ""
	});
	const [alertLoading, setAlertLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const shouldRenderAlert = useDelayUnmount(showAlert, 500);
	const alertBeginTimer = () => setTimeout(() => setShowAlert(false), 3000);
	const alertMountedStyle = { animation: "inAnimation 500ms ease-in" };
	const alertUnmountedStyle = { animation: "outAnimation 500ms ease-in" };

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				const uid = user.uid;
				setUser(user as any);
				setBooksCollectionRef(collection(db, `users/${uid}/books/`));
				setbooksUserRef(uid);
				setAlert({
					type: "success",
					title: `Welcome ${user?.displayName}!`,
					description: "You have successfully signed in."
				});
				// fetchBooks()
				// 	.then((books) => {
				// 		setBooks(books);
				// 	})
				// 	.catch((error) => {});
			}
			// else if (user === null) {
			// 	// User is signed out
			// 	if (isMounted) {
			// 		setUser(null);
			// 		// setAlert({
			// 		// 	type: "success",
			// 		// 	title: "Success",
			// 		// 	description: "You have successfully signed out."
			// 		// });
			// 		setBooks([]);
			// 		// alertBeginTimer();
			// 	}
			// }
		});

		if (user) {
			let isSubscribed = true;
			// fetchBooks().then((books) => {
			// 	if (isSubscribed) {
			// 		setBooks(books);
			// 		setTableLoading(false);
			// 	}
			// });
			return () => {
				isSubscribed = false;
			};
		} else {
			setBooks([]);
			setTableLoading(false);
			setShowAlert(true);
			setAlert({
				type: "danger",
				title: "You are not logged in",
				description: "Please login to see your books or to add new ones."
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (booksUserRef !== "temp") {
			fetchBooks().then((books) => setBooks(books));
		}
	}, [booksUserRef]);

	async function signInWithGoogle() {
		setShowAlert(true);
		setAlertLoading(true);

		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			// const result = await signInWithPopup(auth, provider);

			// The signed-in user info.
			// const user = result.user;
			// setUser(user);
			// setAlert({
			// 	type: "success",
			// 	title: `Welcome ${user.displayName}!`,
			// 	description: "You have successfully signed in."
			// });
			// const userBooks = await fetchBooks();
			// setBooks(userBooks);
		} catch (error: any) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			setAlert({
				type: "error",
				title: `Error: ${errorCode}`,
				description: errorMessage + `\nProvided email: ${email ? email : "None"}`
			});
			setUser(null);
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
			setBooks([]);
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
			if (user) {
				setAlert({
					type: "error",
					title: "Error!",
					description: "Book could not be added."
				});
			} else {
				setAlert({
					type: "error",
					title: "Error!",
					description: "You need to login to add books."
				});
			}
		} finally {
			setAlertLoading(false);
			alertBeginTimer();
		}
	}

	async function fetchBooks() {
		try {
			const data = await getDocs(booksCollectionRef);
			const books = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			if (books.length === 0) {
				setAlert({
					type: "danger",
					title: "No books found",
					description: "Connection was successful, but no books were found."
				});
			} else {
				setAlert({
					type: "success",
					title: "Success",
					description: "Books fetched successfully"
				});
			}

			return books as Book[];
		} catch (e) {
			if (user) {
				setAlert({
					type: "error",
					title: "Error!",
					description: "Books could not be fetched."
				});
			} else {
				setAlert({
					type: "danger",
					title: "Notice",
					description: "You need to login to see your books."
				});
			}
			return [];
		}
	}

	async function updateBookRead(id: string, read: boolean) {
		setShowAlert(true);
		setAlertLoading(true);
		try {
			const bookDoc = doc(db, "users", booksUserRef, "books", id);
			await updateDoc(bookDoc, { read: read });
			const updatedBooks = await fetchBooks();
			setBooks(updatedBooks);
			setAlert({
				type: "success",
				title: "Success",
				description: "Book updated successfully"
			});
		} catch (e) {
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
		const bookRef = doc(db, `users/${booksUserRef}/books/${book.id}`);

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
		<HashRouter basename={prodBaseName}>
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
		</HashRouter>
	);
}
