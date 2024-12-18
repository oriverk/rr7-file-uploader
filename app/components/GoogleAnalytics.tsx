type Props = {
	trackingId: string;
};
export function GoogleAnalytics(props: Props) {
	const { trackingId } = props;

	return (
		<>
			<script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
			/>
			<script
				async
				id="gtag-init"
				dangerouslySetInnerHTML={{
					__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${trackingId}', {
                  page_path: window.location.pathname,
                });
              `,
				}}
			/>
		</>
	);
}
