/** @format */

export default function AddBooks({ submitHandler }: { submitHandler: Function }) {
	return (
		<div className='AddBooks'>
			<div className='col'>
				<h1>Add Books</h1>
				<form onSubmit={(e) => submitHandler(e)}>
					<div className='row input-field'>
						<label htmlFor='bookName'>Book Name:</label>
						<input type='text' id='bookName' name='bookName' required />
					</div>
					<div className='row input-field'>
						<label htmlFor='authorName'>Author:</label>
						<input type='text' id='authorName' name='authorName' required />
					</div>
					<div className='row input-field'>
						<label htmlFor='pagesInput'>Pages:</label>
						<input type='number' id='pagesInput' name='pagesInput' />
					</div>
					<div className='row input-field'>
						<label htmlFor='readInput'>Read:</label>
						<input type='checkbox' id='readInput' name='readInput' />
					</div>
					<div className='row' style={{ justifyContent: "center" }}>
						<button id='bookSubmit' type='submit' style={{ justifySelf: "end" }}>
							Add Book
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
