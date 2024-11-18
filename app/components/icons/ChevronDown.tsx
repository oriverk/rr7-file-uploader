import { twJoin } from "tailwind-merge";

type Props = {
	className?: string;
};

export function ChevronDownIcon(props: Props) {
	const { className = "w-6 h-6" } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			className={twJoin("w-6 h-6", className)}
		>
			<title>down</title>
			<path d="M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z" />
		</svg>
	);
}
