import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { FileCard } from "@/components/FileCard";
import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { requireAdmin } from "@/server/auth.server";
import { getUser, getUserFiles } from "@/server/database.server";
import type { FirestoreFile } from "@/types";
import invariant from "tiny-invariant";
import type { Route } from "./+types/userFiles";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	invariant(params.username, "params.usename is required");
	const user = await getUser(params.username);
	invariant(user.id, "user not found");
	const { username, displayName, profile, profileImageUrl } = user;

	// for demo;
	const admin = requireAdmin(user.email ?? "");
	const userid = !admin.isAdmin ? admin.adminId : user.id;
	let files = await getUserFiles(userid, true);
	if (!admin.isAdmin) {
		files = files.map((file, index) => {
			const { fileName, fileDescription, ...rest } = file;
			return {
				...rest,
				fileName: `demo-${index}.zip`,
				fileDescription: "file description for demo",
			};
		});
	}

	return {
		// for demo
		isAdmin: admin.isAdmin,
		user: {
			username,
			displayName,
			profile,
			profileImageUrl,
		},
		files,
	};
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { isAdmin, user, files } = loaderData;
	const { username, displayName, profile, profileImageUrl } = user;
	const { currentItems, endIndex, goToPage, nextPage, prevPage } =
		usePagination<FirestoreFile>(files, 6, 1);

	return (
		<main className="py-12">
			<Container>
				<div className="flex flex-col gap-8">
					{!isAdmin && (
						<Alert state="info">
							This is a demo account, but it displays files from other accounts
							under different names.
						</Alert>
					)}
					<div className="py-8 flex flex-col items-center gap-8 md:flex-row">
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
							<h1>{displayName}</h1>
							<p>{profile}</p>
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
		</main>
	);
}
