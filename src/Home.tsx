/** @format */
import Book from "./interface/Book";
import Loading from "./Loading";
import { CrossIcon } from "./Icons";

export default function Home({
	books,
	removeBookHandler,
	updateBookHandler,
	loading
}: {
	books: Book[];
	removeBookHandler: Function;
	updateBookHandler: Function;
	loading: boolean;
}) {
	if (loading) {
		return <Loading />;
	} else if (books.length === 0) {
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
					<thead>
						<tr>
							<th>Name</th>
							<th>Author</th>
							<th>Pages</th>
							<th>Read</th>
							<th style={{ color: "var(--error)" }}>Remove</th>
						</tr>
					</thead>
					<tbody>
						{books.map((book) => (
							<tr key={book.id}>
								<td>{book.name}</td>
								<td>{book.author}</td>
								<td>{book.pages}</td>
								<td>
									<input
										type='checkbox'
										defaultChecked={book.read}
										onChange={(event) => {
											updateBookHandler(book.id, event.target.checked);
										}}
									/>
								</td>
								<td>
									<span className='Button__Delete disable-select' onClick={() => removeBookHandler(book)}>
										<CrossIcon />
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
