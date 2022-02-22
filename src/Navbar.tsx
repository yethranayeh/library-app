/** @format */

import { Link } from "react-router-dom";
import { HomeIcon, PlusIcon, CrossIcon, UserIcon } from "./Icons";

export default function Navbar({ user, login, logout }: { user: any; login: Function; logout: Function }) {
	return (
		<nav className='Navbar'>
			<Link to='/' className='Navbar__Link disable-select'>
				<HomeIcon />
				<span>Home</span>
			</Link>
			<Link to='/add-books' className='Navbar__Link disable-select'>
				<PlusIcon />
				<span>Add Books</span>
			</Link>
			{user ? (
				<span onClick={() => logout()} className='Navbar__Link disable-select'>
					{user.displayName}
					<CrossIcon />
				</span>
			) : (
				<span
					onClick={() => {
						login();
					}}
					className='Navbar__Link disable-select'>
					<UserIcon />
					<span>Login</span>
				</span>
			)}
		</nav>
	);
}
