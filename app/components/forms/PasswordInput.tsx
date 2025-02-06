import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { EyeClosedIcon, EyeIcon } from "../icons";

const styles = tv({
	base: "input w-full",
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
	const { className, placeholder = "password", isError, ...restProps } = props;
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="relative">
			<input
				{...restProps}
				type={showPassword ? "text" : "password"}
				placeholder={placeholder}
				className={styles({ isError, className })}
			/>
			<button
				type="button"
				className="absolute inset-y-0 right-0 flex items-center p-1 mr-3 rounded-lg focus:outline-none focus:ring focus:ring-primary-500"
				onClick={() => setShowPassword((prev) => !prev)}
			>
				{showPassword ? (
					<EyeIcon className="h-5 w-5 fill-current" />
				) : (
					<EyeClosedIcon className="h-5 w-5 fill-current" />
				)}
			</button>
		</div>
	);
}

export const PasswordInput = Component;
