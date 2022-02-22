/** @format */

import { db } from "./Firebase-config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
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

export default function App() {
	const [tableLoading, setTableLoading] = useState(true);
	const [alert, setAlert] = useState({
		type: "",
		title: "",
		description: ""
	});
	const [showAlert, setShowAlert] = useState(true);
	const [alertLoading, setAlertLoading] = useState(false);
	const [books, setBooks] = useState([] as Book[]);

	const booksCollectionRef = collection(db, "books");

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

	async function addBook(book: Book) {
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
		}
	}

	async function removeBook(book: Book) {
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
			<Navbar />
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
			{showAlert && <Alert loading={alertLoading} alert={alert as AlertObj} />}
		</BrowserRouter>
	);
}
