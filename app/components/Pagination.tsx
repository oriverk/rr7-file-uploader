type Props = {
	handleFirstPage: () => void;
	handlePreviousPage: () => void;
	handleNextPage: () => void;
	handleLastPage: () => void;
};

export function Pagination(props: Props) {
	const {
		handleFirstPage,
		handlePreviousPage,
		handleNextPage,
		handleLastPage,
	} = props;

	return (
		<div className="join grid grid-cols-4">
			<button
				type="button"
				className="join-item btn btn-outline"
				onClick={handleFirstPage}
			>
				{"<<"}
			</button>
			<button
				type="button"
				className="join-item btn btn-outline"
				onClick={handlePreviousPage}
			>
				{"<"}
			</button>
			<button
				type="button"
				className="join-item btn btn-outline"
				onClick={handleNextPage}
			>
				{">"}
			</button>
			<button
				type="button"
				className="join-item btn btn-outline"
				onClick={handleLastPage}
			>
				{">>"}
			</button>
		</div>
	);
}
