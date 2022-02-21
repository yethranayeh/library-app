/** @format */
import Book from "./interface/Book";

export default function Home({ books }: { books: Book[] }) {
	if (books.length === 0) {
		return (
			<div className='App'>
				<div className='col'>
					<h1>Books</h1>
					<p>No books found. Add books to see them here.</p>
				</div>
			</div>
		);
	}

	return (
		<div className='App container'>
			<div className='col'>
				<h1>Books</h1>
				<table className='Books__Table'>
					<tr>
						<th>Name</th>
						<th>Author</th>
						<th>Pages</th>
						<th>Read</th>
						<th style={{ color: "var(--danger)" }}>Remove</th>
					</tr>
					{books.map((book) => (
						<tr key={book.name}>
							<td>{book.name}</td>
							<td>{book.author}</td>
							<td>{book.pages}</td>
							<td>
								<input type='checkbox' defaultChecked={book.read} />
							</td>
							<td>
								<span className='Button__Delete disable-select' onClick={() => ""}>
									Remove
								</span>
							</td>
						</tr>
					))}
				</table>
			</div>
		</div>
	);
}
