import { Link } from "@remix-run/react";
import type { FC } from "react";
import { Facebook, X, YouTube } from "../icons";

export const Footer: FC = () => {
	return (
		<footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
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
			<nav>
				<div className="grid grid-flow-col gap-4">
					<a href="/">
						<X />
					</a>
					<a href="/">
						<YouTube />
					</a>
					<a href="/">
						<Facebook />
					</a>
				</div>
			</nav>
			<aside>
				<p>
					Copyright &#xA9; {new Date().getFullYear()} - All right reserved by
					Uploader
				</p>
			</aside>
		</footer>
	);
};
