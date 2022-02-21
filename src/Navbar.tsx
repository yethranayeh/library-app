/** @format */

import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className='Navbar'>
			<Link to='/' className='Navbar__Link'>
				Home
			</Link>
			<Link to='/add-books' className='Navbar__Link'>
				Add Books
			</Link>
		</nav>
	);
}
