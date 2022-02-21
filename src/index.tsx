/** @format */

import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import App from "./App";
import AddBooks from "./AddBooks";

const devBaseName = "";
// const prodBaseName = "/library-app";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter basename={devBaseName}>
			<Navbar />
			<Routes>
				<Route path='/' element={<App />} />
				<Route path='/add-books' element={<AddBooks />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
