import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const styles = tv({
	base: "textarea textarea-bordered text-base",
	variants: {
		isError: {
			true: "textarea-error",
		},
	},
	defaultVariants: {
		isError: false,
	},
});

type Props = VariantProps<typeof styles> &
	Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "class" | "style"> & {
		className?: string;
	};

function Component(props: Props) {
	const { className, isError, ...restProps } = props;
	return (
		<textarea
			{...restProps}
			className={styles({ isError, className })}
			// @ts-ignore
			style={{ fieldSizing: "content" }}
		/>
	);
}

export const Textarea = Component;
