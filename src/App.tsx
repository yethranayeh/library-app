/** @format */

import { db } from "./Firebase-config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import AddBooks from "./AddBooks";
import Book from "./interface/Book";

const devBaseName = "";
// const prodBaseName = "/library-app";

export default function App() {
	const [loading, setLoading] = useState(true);
	const [books, setBooks] = useState([] as Book[]);

	const booksCollectionRef = collection(db, "books");

	useEffect(() => {
		let isSubscribed = true;
		fetchBooks().then((books) => {
			if (isSubscribed) {
				setBooks(books);
				setLoading(false);
			}
		});
		return () => {
			isSubscribed = false;
		};
	}, []);

	async function addBook(book: Book) {
		try {
			await addDoc(booksCollectionRef, book);
			const updatedBooks = await fetchBooks();
			setBooks(updatedBooks);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}

	async function fetchBooks() {
		const data = await getDocs(booksCollectionRef);
		const books = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

		return books as Book[];
	}

	async function updateBookRead(id: string, read: boolean) {
		const bookDoc = doc(db, "books", id);
		await updateDoc(bookDoc, { read: read });
		const updatedBooks = await fetchBooks();
		setBooks(updatedBooks);
	}

	async function removeBook(book: Book) {
		const bookRef = doc(db, `books/${book.id}`);
		await deleteDoc(bookRef)
			.then(() => {
				// Update the books state after successful deletion
				fetchBooks().then((books) => {
					setBooks(books);
				});
			})
			.catch((error) => {
				console.error("Error removing document: ", error);
			});
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
						<Home loading={loading} books={books} removeBookHandler={removeBook} updateBookHandler={updateBookRead} />
					}
				/>
				<Route path='/add-books' element={<AddBooks submitHandler={submitHandler} />} />
			</Routes>
		</BrowserRouter>
	);
}
