import type { FC } from "react";
import { Link } from "react-router";
import { Container } from "../Container";

export const Footer: FC = () => {
	return (
		<footer className="not-prose">
			<Container
				maxWidth="wide"
				className="footer footer-horizontal footer-center max-w-none bg-base-200 text-base-content p-10"
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
