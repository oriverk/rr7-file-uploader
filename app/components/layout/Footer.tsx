import { Link } from "@remix-run/react";
import type { FC } from "react";
import { Container } from "../Container";
import { FacebookIcon, XIcon, YouTubeIcon } from "../icons";

export const Footer: FC = () => {
	return (
		<footer>
			<Container
				maxWidth="wide"
				className="footer footer-center max-w-none bg-base-200 text-base-content p-10"
			>
				<nav className="grid grid-flow-col gap-4">
					<Link className="link link-hover" to="/">
						About us
					</Link>
					<Link className="link link-hover" to="/lorem">
						Contact
					</Link>
					<Link className="link link-hover" to="/terms">
						Terms of Use
					</Link>
					<Link className="link link-hover" to="/privacy">
						Privacy Policy
					</Link>
				</nav>
				{/* <nav>
					<div className="grid grid-flow-col gap-4">
						<a href="/">
							<XIcon />
						</a>
						<a href="/">
							<YouTubeIcon />
						</a>
						<a href="/">
							<FacebookIcon />
						</a>
					</div>
				</nav> */}
				<aside>
					<p>
						Copyright &#xA9; {new Date().getFullYear()} - All right reserved by
						Uploader
					</p>
				</aside>
			</Container>
		</footer>
	);
};
