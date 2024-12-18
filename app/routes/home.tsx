export default function Index() {
	return (
		// <article>
		// 	<Container
		// 		maxWidth="wide"
		// 		className="not-prose hero max-w-none min-h-screen"
		// 	>
		// 		<div className="hero-content text-center">
		// 			<div className="max-w-md">
		// 				<h1 className="text-5xl font-bold">What's up?</h1>
		// 				<p className="py-6">
		// 					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
		// 					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
		// 					enim ad minim veniam, quis nostrud exercitation ullamco laboris
		// 					nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
		// 					reprehenderit in voluptate velit esse cillum dolore eu fugiat
		// 					nulla pariatur. Excepteur sint occaecat cupidatat non proident,
		// 					sunt in culpa qui officia deserunt mollit anim id est laborum.
		// 				</p>
		// 			</div>
		// 		</div>
		// 	</Container>
		// </article>
		<main className="container mt-8 mx-auto flex flex-1 flex-col items-center">
			<div
				className="hero min-h-screen"
				// style={{
				// 	backgroundImage:
				// 		"url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
				// }}
			>
				{/* <div className="hero-overlay bg-opacity-60" /> */}
				<div className="hero-content text-center">
					<div className="max-w-md">
						<h1 className="mb-5 text-5xl font-bold">Hello there</h1>
						<p className="mb-5">
							Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
							excepturi exercitationem quasi. In deleniti eaque aut repudiandae
							et a id nisi.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
