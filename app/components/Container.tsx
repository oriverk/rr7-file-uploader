import { type VariantProps, tv } from "tailwind-variants";

const styles = tv({
	base: "Container mx-auto px-5 md:px-6 lg:px-10",
	variants: {
		size: {},
		maxWidth: {
			default: "max-w-4xl",
			wide: "max-w-4xl",
		},
	},
	defaultVariants: {
		maxWidth: "default",
	},
});

type Props = VariantProps<typeof styles> & {
	children: React.ReactNode;
	className?: string;
};

function Component(props: Props) {
	const { children, ...restProps } = props;

	return <div className={styles(restProps)}>{children}</div>;
}

export const Container = Component;
