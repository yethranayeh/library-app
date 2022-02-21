/** @format */

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import AddBooks from "./AddBooks";
import Book from "./interface/Book";

const devBaseName = "";
// const prodBaseName = "/library-app";

export default function App() {
	const [books, setBooks] = useState([] as Book[]);

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

		setBooks([...books, newBook]);
	}

	return (
		<BrowserRouter basename={devBaseName}>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home books={books} />} />
				<Route path='/add-books' element={<AddBooks submitHandler={submitHandler} />} />
			</Routes>
		</BrowserRouter>
	);
}
