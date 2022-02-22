/** @format */
import Book from "./interface/Book";
import Loading from "./Loading";

function CrossIcon() {
	return (
		<svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z'
				fill='currentColor'
				fillRule='evenodd'
				clipRule='evenodd'></path>
		</svg>
	);
}

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
