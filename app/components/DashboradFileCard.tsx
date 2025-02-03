import type { FirestoreFile } from "@/types";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { format } from "date-fns";
import { Link } from "react-router";
import { CloseIcon, DownloadIcon, FileIcon } from "./icons";

type Props = {
	path: string;
	file: FirestoreFile;
	handleClickDelete: () => void;
};

export function DashboardFileCard(props: Props) {
	const { path, file, handleClickDelete } = props;
	const { fileName, downloadCount, size, createdAt, updatedAt, isPublished } =
		file;
	const _size = convertByteWithUnit(size);
	const _createdAt = format(createdAt, "yyyy年MM月dd日");
	const _updatedAt =
		createdAt !== updatedAt ? format(updatedAt, "yyyy年MM月dd日") : undefined;

	return (
		<div className="card bg-neutral text-neutral-content shadow-lg">
			<div className="card-body gap-4">
				<div className="flex justify-center">
					<div className="flex-1 card-title items-start">
						<Link
							to={path}
							className="link link-hover break-all overflow-hidden line-clamp-2 text-ellipsis"
						>
							{fileName}
						</Link>
					</div>
					<div>
						<button
							tabIndex={0}
							type="button"
							onClick={handleClickDelete}
							className="group btn btn-ghost hover:btn-error btn-sm btn-square"
						>
							<CloseIcon className="h-4 w-4 fill-current" />
						</button>
					</div>
				</div>
				<div className="card-actions gap-4">
					<div>
						<span>公開：</span>
						<time dateTime={createdAt.toISOString()}>{_createdAt}</time>
					</div>
					{!!_updatedAt && (
						<div>
							<span>更新：</span>
							<time dateTime={updatedAt.toISOString()}>{_updatedAt}</time>
						</div>
					)}
				</div>
				<div className="card-actions items-center gap-4">
					{isPublished ? (
						<div className="badge badge-primary">公開中</div>
					) : (
						<div className="badge badge-secondary">非公開</div>
					)}
					<div className="flex items-center gap-2 text-sm">
						<FileIcon className="w-4 h-4 fill-current" />
						<span className="sr-only">ファイルサイズ</span>
						<span>{_size}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<DownloadIcon className="w-4 h-4 fill-current" />
						<span className="sr-only">ダウンロード数</span>
						<span>{downloadCount}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
