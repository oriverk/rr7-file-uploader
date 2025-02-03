import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const styles = tv({
	base: "file-input",
	variants: {
		isError: {
			true: "file-input-error",
		},
	},
	defaultVariants: {
		isError: false,
	},
});

type Props = VariantProps<typeof styles> &
	Omit<InputHTMLAttributes<HTMLInputElement>, "class"> & {
		className?: string;
	};

function Component(props: Props) {
	const { className, isError, ...restProps } = props;
	return (
		<input
			{...restProps}
			type="file"
			className={styles({ isError, className })}
		/>
	);
}

export const FileInput = Component;
