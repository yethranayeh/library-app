/** @format */

import { Link } from "react-router-dom";

function HomeIcon() {
	return (
		<svg width='20' height='20' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z'
				fill='currentColor'
				fillRule='evenodd'
				clipRule='evenodd'></path>
		</svg>
	);
}

function PlusIcon() {
	return (
		<svg width='20' height='20' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z'
				fill='currentColor'
				fillRule='evenodd'
				clipRule='evenodd'></path>
		</svg>
	);
}

export default function Navbar() {
	return (
		<nav className='Navbar'>
			<Link to='/' className='Navbar__Link'>
				<HomeIcon />
				<span>Home</span>
			</Link>
			<Link to='/add-books' className='Navbar__Link'>
				<PlusIcon />
				<span>Add Books</span>
			</Link>
		</nav>
	);
}
