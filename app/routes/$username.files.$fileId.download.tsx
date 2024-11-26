import { Container } from "@/components/Container";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { getUser, getUserFile } from "../server/firestore.server";
import { convertByteWithUnit } from "../utils/convertByteWithUnit";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.username, "params.username is requied");
	invariant(params.fileId, "params.fileId is required");
	const user = await getUser(params.username);
	invariant(user.id, "user not found");

	const { username, displayName, profileImageUrl } = user;
	const file = await getUserFile(user.id ?? "", params.fileId);

	invariant(file, `File not found: ${params.fileId}`);

	const { id, fileDescription, filePath, deletedAt, isPublished, ...rest } =
		file;
	return typedjson({
		user: { username, displayName, profileImageUrl },
		file: {
			...rest,
		},
	});
};

export default function UserFile() {
	const { user, file } = useTypedLoaderData<typeof loader>();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const { username, displayName, profileImageUrl } = user;
	const { fileName, contentType, size, createdAt, updatedAt, downloadCount } =
		file;

	const handleConfirm = () => {
		setIsConfirmed(!isConfirmed);
	};

	const handleDownload = () => {
		setIsConfirmed(false);
	};

	return (
		<article>
			<Container maxWidth="wide">
				<div className="">
					<div className="py-4 flex flex-col gap-4 items-center justify-evenly">
						<h1 className="mb-0 break-words">{fileName}</h1>
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
												<td>{convertByteWithUnit(size)}</td>
											</tr>
											<tr>
												<th>ダウンロード数</th>
												<td>{downloadCount}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<p>
									ダウンロードを続けるには、
									<Link to="/terms" className="link">
										利用規約
									</Link>
									に同意した上で「ダウンロード」ボタンを押下してください。ダウンロードが開始されます。
								</p>

								<div className="form-control mb-4">
									<label className="label cursor-pointer justify-center">
										<input
											type="checkbox"
											name="confirm"
											checked={isConfirmed}
											onChange={handleConfirm}
											className="checkbox checkbox-primary"
										/>
										<span className="label-text ml-4">同意する</span>
									</label>
								</div>
								{isConfirmed && (
									<Link
										to="execute"
										download
										reloadDocument
										onClick={handleDownload}
										className="btn btn-block btn-primary"
									>
										ダウンロードする
									</Link>
								)}
							</div>
						</Container>
					</div>
				</section>
			</Container>
		</article>
	);
}
