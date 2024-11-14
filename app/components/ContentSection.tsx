import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
	id?: string;
	title?: string;
	description?: string;
	children: ReactNode;
	align?: "left" | "top" | "right";
	contentClassName?: string;
};

export function ContentSection(props: Props) {
	const { id, title, description, children, contentClassName } = props;

	return (
		<section
			id={id}
			className="flex flex-col items-center justify-between gap-10 py-12"
		>
			{title && (
				<div className="title-area flex-[2] flex flex-col justify-center items-center text-center gap-4">
					<div className="text flex flex-col justify-center items-center gap-1">
						{title && <h2>{title}</h2>}
						{description && <p>{description}</p>}
					</div>
				</div>
			)}
			<div className={clsx("content-area flex-[5]", contentClassName)}>
				{children}
			</div>
		</section>
	);
}
