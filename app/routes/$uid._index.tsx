import { FileCard } from "@/components/FileCard";
import { Pagination } from "@/components/Pagination";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { ContentSection } from "../components/ContentSection";
import { firestore } from "../server/firebase.server";
import { getUserFiles } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.uid, "params.uid is required");
	const userSnapshot = await firestore
		.collection("users")
		.where("uid", "==", params.uid)
		.limit(1)
		.get();
	invariant(!userSnapshot.empty, "user not found");
	const userDoc = userSnapshot.docs[0];
	const user = userDoc.data();
	const { displayName, profile, profileImageUrl } = user;
	const userId = userDoc.id;
	const files = await getUserFiles(userId);
	// invariant(files.length, `Files not found: ${params.uid}`);
	const { uid } = params;

	return typedjson({
		uid,
		user: {
			uid,
			displayName,
			profile,
			profileImageUrl,
		},
		files,
	});
};

export default function UserFiles() {
	const { uid, files } = useTypedLoaderData<typeof loader>();
	const pageSize = 5;
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
		<div>
			<h1 className="text-center">{uid} files</h1>
			<ContentSection title="ファイル一覧">
				<div className="flex flex-col gap-8">
					<Pagination
						handleFirstPage={handleFirstPage}
						handlePreviousPage={handlePreviousPage}
						handleNextPage={handleNextPage}
						handleLastPage={handleLastPage}
					/>
					{currentItems.map((file) => {
						const path = `/${uid}/files/${file.id}`;
						return (
							<article key={file.id}>
								<FileCard file={file} path={path} />
							</article>
						);
					})}
				</div>
			</ContentSection>
		</div>
	);
}
