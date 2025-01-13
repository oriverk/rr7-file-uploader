import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { CONTENT_TYPES } from "@/constants";
import { requireAdmin } from "@/server/auth.server";
import { getUser, getUserFile } from "@/server/database.server";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { parseMarkdown } from "@/utils/markdown";
import { format } from "date-fns";
import { Link } from "react-router";
import invariant from "tiny-invariant";
import type { Route } from "./+types/fileDetail";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	invariant(params.username, "params.username is requied");
	invariant(params.fileId, "params.fileId is required");
	const user = await getUser(params.username);
	invariant(user.id, "user not found");

	// for demo
	const admin = requireAdmin(user.email);
	const userId = !admin.isAdmin ? admin.adminId : user.id;
	const file = await getUserFile(userId, params.fileId);
	invariant(file, `File not found: ${params.fileId}`);

	const { username, displayName, profileImageUrl } = user;
	const { id, fileName, fileDescription, filePath, deletedAt, ...rest } = file;
	// for demo
	const filename = !admin.isAdmin ? "demo.zip" : fileName;
	const desc = !admin.isAdmin ? "file description for demo" : fileDescription;

	const html = parseMarkdown(desc ?? "");
	return {
		// for demo
		isAdmin: admin.isAdmin,
		user: { username, displayName, profileImageUrl },
		file: {
			...rest,
			fileName: filename,
			fileDescription: html,
		},
	};
};

export default function UserFile({ loaderData }: Route.ComponentProps) {
	const { isAdmin, user, file } = loaderData;
	const { username, displayName, profileImageUrl } = user;
	const {
		fileName,
		contentType,
		size,
		createdAt,
		updatedAt,
		downloadCount,
		fileDescription,
	} = file;

	const extension = CONTENT_TYPES[contentType];

	return (
		<main className="py-12">
			<Container maxWidth="wide">
				<div>
					<div className="py-4 flex flex-col gap-4 items-center justify-evenly">
						{!isAdmin && (
							<Alert state="info">
								This is a demo account, but it displays files from other
								accounts under different names.
							</Alert>
						)}
						<h1 className="mb-0 break-all">{fileName}</h1>
						<Link to={`/${username}`} className="no-underline">
							<div className="flex items-center gap-4">
								<div className="avatar">
									<div className="w-12 rounded-full ring-info ring-offset-base-100 ring ring-offset-2">
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
								<div className="text-lg">{displayName}</div>
							</div>
						</Link>
						<div className="flex flex-wrap gap-4">
							<div>
								<span>公開：</span>
								<time dateTime={createdAt.toISOString()}>
									{format(createdAt, "yyyy年MM月dd日")}
								</time>
							</div>
							{createdAt !== updatedAt && (
								<div>
									<span>更新：</span>
									<time dateTime={updatedAt.toISOString()}>
										{format(updatedAt, "yyyy年MM月dd日")}
									</time>
								</div>
							)}
						</div>
					</div>
				</div>
			</Container>
			<Container maxWidth="wide">
				<section>
					<div className="py-8">
						<div className="flex flex-col justify-around gap-8">
							<div className="overflow-x-auto">
								<table className="table">
									<tbody>
										<tr>
											<th>ファイルタイプ</th>
											<td>{extension}</td>
										</tr>
										<tr>
											<th>サイズ</th>
											<td>{convertByteWithUnit(size)}</td>
										</tr>
										<tr>
											<th>ダウンロード数</th>
											<td>{downloadCount}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div
								dangerouslySetInnerHTML={{ __html: fileDescription }}
								className="break-words prose-img:rounded-xl"
							/>
							<Link to="download" className="btn btn-primary">
								ダウロードページへ
							</Link>
							<Link to={`/${username}`} className="btn btn-secondary btn-block">
								ファイル一覧へ戻る
							</Link>
						</div>
					</div>
				</section>
			</Container>
		</main>
	);
}
