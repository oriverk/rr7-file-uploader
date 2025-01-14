import { Alert } from "@/components/Alert";
import { Container } from "@/components/Container";
import { DashboardFileCard } from "@/components/DashboradFileCard";
import { Pagination } from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { requireAdmin, requireAuth } from "@/server/auth.server";
import { getUserFiles, softDeleteUserFile } from "@/server/database.server";
import type { FirestoreFile } from "@/types";
import { useRef, useState } from "react";
import { Link, data, useSubmit } from "react-router";
import type { Route } from "./+types/dashboard";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const user = await requireAuth(request);
	// for demo;
	const admin = requireAdmin(user.email ?? "");
	const userid = !admin.isAdmin ? admin.adminId : user.uid;
	let files = await getUserFiles(userid, false);
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
		isAdmin: admin.isAdmin,
		files,
	};
};

export const action = async ({ params, request }: Route.ActionArgs) => {
	const form = await request.formData();
	const fileId = form.get("fileId");
	const user = await requireAuth(request);

	try {
		if (typeof fileId !== "string") {
			throw new Error("file id does not exist.");
		}

		// for demo
		const admin = requireAdmin(user.email ?? "");
		if (!admin.isAdmin) {
			return {
				success: false,
				message: "This is demo app. You can't delete a file.",
			};
		}
		await softDeleteUserFile(user.uid, fileId);
		return {
			success: true,
			message: "file was deleted successfully",
		};
	} catch (error) {
		console.error("failed to delete file", error);
		return data(
			{
				success: false,
				message: String(error),
			},
			{ status: 401 },
		);
	}
};

type DeletingFile = Record<"fileId" | "fileName", string>;

export default function Page({ loaderData, actionData }: Route.ComponentProps) {
	const { isAdmin, files } = loaderData;
	const [deletingFile, setDeletingFile] = useState<DeletingFile | null>(null);
	const { currentItems, endIndex, goToPage, nextPage, prevPage } =
		usePagination<FirestoreFile>(files, 10, 1);
	const submit = useSubmit();
	const dialog = useRef<HTMLDialogElement>(null);

	const handleOpenModal = (file: DeletingFile) => {
		if (!dialog.current) return;
		const { fileId, fileName } = file;
		setDeletingFile({ fileId, fileName });
		dialog.current.showModal();
	};

	const handleCloseModal = () => {
		if (!dialog.current) return;
		setDeletingFile((prev) => null);
		dialog.current.close();
	};

	const handleDelete = () => {
		if (!dialog.current) return;
		if (!deletingFile) return;
		const { fileId } = deletingFile;
		submit({ fileId }, { method: "post" });
		dialog.current.close();
	};

	return (
		<>
			<main className="py-12">
				<Container>
					<section className="flex flex-col gap-8">
						{/* for demo */}
						{!isAdmin && (
							<Alert state="info">
								This is a demo account, but it displays files from other
								accounts under different names.
							</Alert>
						)}
						{actionData?.message && (
							<Alert state={actionData.success ? "info" : "error"}>
								{actionData.message}
							</Alert>
						)}
						<h1 className="text-center">ファイルの管理</h1>
						{!files.length ? (
							<div className="">
								<Link to="/files/new" className="btn btn-primary">
									アップロード
								</Link>
							</div>
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
										const { id = "", fileName } = file;
										const path = `/files/${id}/edit`;
										return (
											<div key={id}>
												<DashboardFileCard
													path={path}
													file={file}
													handleClickDelete={() =>
														handleOpenModal({ fileId: id, fileName })
													}
												/>
											</div>
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
			<dialog className="modal" ref={dialog}>
				<div className="modal-box">
					<h3 className="font-bold text-lg text-center">削除しますか？</h3>
					<p className="py-4">
						{`ファイル「${deletingFile?.fileName}」を削除しようとしています。この操作は戻すことができません。`}
					</p>
					<div className="modal-action justify-center">
						<form method="dialog" className="flex gap-8">
							<button type="button" onClick={handleCloseModal} className="btn">
								キャンセル
							</button>
							<button
								type="button"
								onClick={handleDelete}
								className="btn btn-error"
							>
								削除する
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
