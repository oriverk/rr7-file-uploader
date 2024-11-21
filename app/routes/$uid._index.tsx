import { Container } from "@/components/Container";
import { FileCard } from "@/components/FileCard";
import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import type { FirestoreFile } from "@/types/firestore";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { getUser, getUserFiles } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.uid, "params.uid is required");
	const user = await getUser(params.uid);

	invariant(user.id, "user not found");
	const { displayName, profile, profileImageUrl } = user;
	const files = await getUserFiles(user.id, true);
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
	const { user, files } = useTypedLoaderData<typeof loader>();
	const { uid, profile } = user;
	const { currentItems, endIndex, goToPage, nextPage, prevPage } =
		usePagination<FirestoreFile>(files, 6, 1);

	return (
		<article>
			<Container>
				<div>
					<div className="py-12 flex flex-col items-center gap-8 md:flex-row">
						<div className="avatar">
							<div className="w-32 rounded-full">
								<img
									alt="avator"
									src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
									className="not-prose"
								/>
							</div>
						</div>
						<div className="info">
							<h1 className="m-0">{uid}</h1>
							<p className="p-0">{profile}</p>
							<div>
								<span className="font-bold">{files.length}</span> files
							</div>
						</div>
					</div>
				</div>
			</Container>
			<Container>
				<section className="py-8">
					<h2 className="text-center">ファイル一覧</h2>
					<div className="flex flex-col gap-8 items-center">
						<Pagination
							handleFirstPage={() => goToPage(1)}
							handlePreviousPage={prevPage}
							handleNextPage={nextPage}
							handleLastPage={() => goToPage(endIndex)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
							{currentItems.map((file) => {
								const path = `/${uid}/files/${file.id}`;
								return (
									<article key={file.id}>
										<FileCard file={file} path={path} />
									</article>
								);
							})}
						</div>
						<Pagination
							handleFirstPage={() => goToPage(1)}
							handlePreviousPage={prevPage}
							handleNextPage={nextPage}
							handleLastPage={() => goToPage(endIndex)}
						/>
					</div>
				</section>
			</Container>
		</article>
	);
}
