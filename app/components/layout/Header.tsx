import { Form, Link } from "@remix-run/react";
import { Container } from "../Container";
import { UploadIcon } from "../icons";
import { HumanIcon } from "../icons/Human";

type Props = {
	isAuthenticated: boolean;
	name: string;
};

export function Header(props: Props) {
	const { isAuthenticated, name } = props;

	return (
		<header>
			<Container maxWidth="wide">
				<div className="flex items-center min-h-16 w-full">
					<div className="flex-1">
						<Link
							to="/"
							className="text-black-800 inline-flex items-center gap-2.5 text-2xl font-bold md:text-3xl"
						>
							<span className="sr-only">Home</span>👆 Uploader
						</Link>
					</div>
					<nav className="flex items-center gap-2">
						{!isAuthenticated ? (
							<div>
								<Link to="/login" className="btn btn-sm btn-primary">
									ログイン
								</Link>
							</div>
						) : (
							<>
								<Link to="/files/new" className="btn btn-sm btn-primary">
									<UploadIcon className="w-4 h-4 fill-current" />
									<span className="hidden sm:block">アップロード</span>
								</Link>
								<div className="dropdown dropdown-end">
									<button
										type="button"
										tabIndex={0}
										className="btn btn-sm btn-outline btn-primary"
									>
										<HumanIcon className="w-6 h-6 fill-current" />
										<span className="hidden sm:block">アカウント</span>
									</button>
									<ul
										tabIndex={0}
										className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
									>
										<li>
											<Link to={`/${name}`}>@{name}</Link>
										</li>
										<li>
											<Link to="/dashboard">ファイルの管理</Link>
										</li>
										<li>
											<Link to="/settings/profile">アカウント設定</Link>
										</li>
										<li>
											<Link to="/logout">ログアウト</Link>
											{/* <Form method="post" action="/logout">
												<button type="submit">ログアウト</button>
											</Form> */}
										</li>
									</ul>
								</div>
							</>
						)}
					</nav>
				</div>
			</Container>
		</header>
	);
}
