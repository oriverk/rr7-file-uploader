import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const styles = tv({
	base: "input",
	variants: {
		isError: {
			true: "input-error",
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
	const {
		className,
		placeholder = "test@example.com",
		isError,
		...restProps
	} = props;
	return (
		<input
			{...restProps}
			type="email"
			placeholder={placeholder}
			className={styles({ isError, className })}
		/>
	);
}

export const TextInput = Component;
