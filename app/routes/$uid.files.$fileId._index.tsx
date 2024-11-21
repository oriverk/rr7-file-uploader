import { Container } from "@/components/Container";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { getUser, getUserFile } from "../server/firestore.server";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";
import { parseMarkdown } from "../utils/markdown";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.uid, "params.uid is requied");
	invariant(params.fileId, "params.fileId is required");
	const user = await getUser(params.uid);
	invariant(user.id, "user not found");

	const { displayName, profile, profileImageUrl } = user;
	const file = await getUserFile(user.id, params.fileId);

	invariant(file, `File not found: ${params.fileId}`);

	const { fileDescription, size, filePath, deletedAt, ...rest } = file;
	const html = parseMarkdown(fileDescription ?? "");
	return typedjson({
		uid: user.uid,
		user: user,
		file: {
			fileDescription: html,
			size: convertByteWithUnit(size ?? 0),
			...rest,
		},
	});
};

export default function UserFile() {
	const { uid, user, file } = useTypedLoaderData<typeof loader>();
	const {
		fileName,
		contentType,
		size,
		createdAt,
		updatedAt,
		downloadCount,
		fileDescription,
	} = file;

	return (
		<article>
			<Container maxWidth="wide">
				<div className="">
					<div className="py-4 flex flex-col gap-4 items-center justify-evenly">
						<h1 className="mb-0 break-words">{fileName}</h1>
						<Link to={`/${user.uid}`} className="no-underline">
							<div className="flex items-center gap-4">
								<div className="avatar">
									<div className="w-12 rounded-full">
										<img
											alt="avator"
											src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
											className="not-prose"
										/>
									</div>
								</div>
								<div className="text-lg">{user.displayName}</div>
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
					<div className="">
						<Container className="py-8 bg-neutral text-neutral-content rounded-sm">
							<div className="flex flex-col justify-around gap-8">
								<div className="overflow-x-auto">
									<table className="table">
										<tbody>
											<tr>
												<th>タイプ</th>
												<td>{contentType}</td>
											</tr>
											<tr>
												<th>サイズ</th>
												<td>{size}</td>
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
							</div>
						</Container>
					</div>
				</section>
			</Container>
		</article>
	);
}
