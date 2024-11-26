import { type VariantProps, tv } from "tailwind-variants";

const styles = tv({
	base: "alert",
	variants: {
		state: {
			info: "alert-info",
			success: "alert-success",
			warning: "alert-warning",
			error: "alert-error",
		},
	},
});

type Props = VariantProps<typeof styles> & {
	className?: string;
	children: string;
};

function Component(props: Props) {
	const { children, ...restProps } = props;

	let data = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
	switch (restProps.state) {
		case "success":
			data = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
			break;
		case "warning":
			data =
				"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
			break;
		case "error":
			data =
				"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
			break;
		default:
			break;
	}

	return (
		<div role="alert" className={styles(restProps)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				className="h-6 w-6 shrink-0 stroke-current"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d={data}
				/>
			</svg>
			<span>{children}</span>
		</div>
	);
}

export const Alert = Component;
