import clsx from "clsx";

type Props = {
	className?: string;
};

export function AdSense(props: Props) {
	const { className = "" } = props;

	return (
		<ins
			className={clsx(className, "adsbygoogle block")}
			data-ad-client="ca-pub-3305972869013074"
			data-ad-slot="3735361497"
			data-ad-format="auto"
			data-full-width-responsive={true}
		/>
	);
}
