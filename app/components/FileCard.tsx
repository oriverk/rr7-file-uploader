import type { FirestoreFile } from "@/types";
import { convertByteWithUnit } from "@/utils/convertByteWithUnit";
import { format } from "date-fns";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { DownloadIcon, FileIcon, HistoryIcon, UploadIcon } from "./icons";

type Props = {
	file: FirestoreFile;
	path: string;
	isAuthenticatd?: boolean;
	actionButton?: ReactNode;
};

export function FileCard(props: Props) {
	const { file, path, isAuthenticatd = false, actionButton } = props;
	const {
		fileName,
		downloadCount,
		size,
		isPublished = false,
		createdAt,
		updatedAt,
	} = file;
	const _size = convertByteWithUnit(size);
	const _createdAt = format(createdAt, "yyyy-MM-dd");
	const _updatedAt =
		createdAt !== updatedAt ? format(updatedAt, "yyyy-MM-dd") : undefined;

	return (
		<div className="card bg-neutral text-neutral-content shadow-lg">
			<div className="card-body gap-4">
				<div className="flex justify-center gap-1">
					<div className="flex-1 card-title items-start">
						<Link
							to={path}
							className="link link-hover break-all overflow-hidden line-clamp-2 text-ellipsis"
						>
							{fileName}
						</Link>
					</div>
					<div>{actionButton}</div>
				</div>
				<div className="card-actions grid grid-cols-2 items-center gap-4">
					<div className="flex items-center gap-2 text-sm">
						<UploadIcon className="w-4 h-4 fill-current" />
						<span className="sr-only">公開</span>
						<time dateTime={createdAt.toISOString()}>{_createdAt}</time>
					</div>
					{!_updatedAt ? (
						<div />
					) : (
						<div className="flex items-center gap-2 text-sm">
							<HistoryIcon className="w-5 h-5 fill-current" />
							<span className="sr-only">更新</span>
							<time dateTime={updatedAt.toISOString()}>{_updatedAt}</time>
						</div>
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
					{!isAuthenticatd ? null : isPublished ? (
						<div className="badge badge-primary">公開中</div>
					) : (
						<div className="badge badge-secondary">非公開</div>
					)}
				</div>
			</div>
		</div>
	);
}
