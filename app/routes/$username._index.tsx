import { Container } from "@/components/Container";
import { FileCard } from "@/components/FileCard";
import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import type { FirestoreFile } from "@/types";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { getUser, getUserFiles } from "../server/firestore.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.username, "params.usename is required");
	const user = await getUser(params.username);

	invariant(user.id, "user not found");
	const { username, displayName, profile, profileImageUrl } = user;
	const files = await getUserFiles(user.id, true);

	return typedjson({
		user: {
			username,
			displayName,
			profile,
			profileImageUrl,
		},
		files,
	});
};

export default function UserFiles() {
	const { user, files } = useTypedLoaderData<typeof loader>();
	const { username, displayName, profile, profileImageUrl } = user;
	const { currentItems, endIndex, goToPage, nextPage, prevPage } =
		usePagination<FirestoreFile>(files, 6, 1);

	return (
		<article>
			<Container>
				<div>
					<div className="py-12 flex flex-col items-center gap-8 md:flex-row">
						<div className="avatar">
							<div className="w-32 rounded-full ring-info ring-offset-base-100 ring ring-offset-2">
								{!profileImageUrl ? (
									<div>&nbsp;</div>
								) : (
									<img
										alt="avator"
										src={profileImageUrl}
										className="not-prose"
									/>
								)}
							</div>
						</div>
						<div className="info">
							<h1 className="m-0">{displayName}</h1>
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
					{!files.length ? (
						<p className="text-center">
							アップロードされたファイルはありません
						</p>
					) : (
						<div className="flex flex-col gap-8 items-center">
							<Pagination
								handleFirstPage={() => goToPage(1)}
								handlePreviousPage={prevPage}
								handleNextPage={nextPage}
								handleLastPage={() => goToPage(endIndex)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
								{currentItems.map((file) => {
									const path = `/${username}/files/${file.id}`;
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
					)}
				</section>
			</Container>
		</article>
	);
}
