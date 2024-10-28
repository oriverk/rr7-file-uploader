import { Link } from "@remix-run/react";
import { Timestamp } from "firebase-admin/firestore";
import { useState } from "react";
import type { IProps as FileData } from "../server/firestore.server";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";

type Props = {
	uid: string;
	files: FileData[];
	pageSize: number;
};

export function FilesTable(props: Props) {
	const { uid, files, pageSize } = props;

	const [page, setPage] = useState(1);
	const startPage = (page - 1) * pageSize;
	const endPage = startPage + pageSize;
	const currentItems = files.slice(startPage, endPage);
	const totalPages = Math.ceil(files.length / pageSize);

	const handleNextPage = () => {
		if (page < totalPages) {
			setPage((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			setPage((prev) => prev - 1);
		}
	};

	const handleFirstPage = () => {
		setPage(1);
	};

	const handleLastPage = () => {
		setPage(totalPages);
	};

	return (
		<>
			<div className="overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th>name</th>
							<th>created at</th>
							<th>updated at</th>
							<th>size</th>
							<th>download</th>
						</tr>
					</thead>
					<tbody>
						{currentItems.map((file) => {
							const { id, name, createdAt, updatedAt, size, downloaded } = file;
							const sizeStr = convertByteWithUnit(size);
							return (
								<tr className="hover" key={id}>
									<td>
										<Link to={`/${uid}/files/${id}`} className="link">
											{name}
										</Link>
									</td>
									<td>
										<time dateTime={createdAt} title={`作成：${createdAt}`}>
											{createdAt}
										</time>
									</td>
									<td>
										<time dateTime={updatedAt} title={`更新：${updatedAt}`}>
											{updatedAt}
										</time>
									</td>
									<td>
										<span title={`${size}byte`}>{sizeStr}</span>
									</td>
									<td>{downloaded}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="join grid grid-cols-4">
				<button
					type="button"
					className="join-item btn btn-outline"
					onClick={handleFirstPage}
				>
					First
				</button>
				<button
					type="button"
					className="join-item btn btn-outline"
					onClick={handlePreviousPage}
				>
					Previous
				</button>
				<button
					type="button"
					className="join-item btn btn-outline"
					onClick={handleNextPage}
				>
					Next
				</button>
				<button
					type="button"
					className="join-item btn btn-outline"
					onClick={handleLastPage}
				>
					Last
				</button>
			</div>
		</>
	);
}
