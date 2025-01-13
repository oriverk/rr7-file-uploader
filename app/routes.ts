import {
	type RouteConfig,
	index,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("join", "./routes/auth/join.tsx"),
	route("login", "./routes/auth/login.tsx"),
	route("logout", "./routes/auth/logout.tsx"),

	route("lorem", "./routes/lorem.tsx"),
	route("privacy", "./routes/privacy.tsx"),
	route("terms", "./routes/terms.tsx"),

	...prefix(":username", [
		index("./routes/userFiles.tsx"),
		...prefix("files/:fileId", [
			index("./routes/fileDetail.tsx"),
			...prefix("download", [
				index("./routes/fileConfirm.tsx"),
				route("execute", "./routes/fileDownload.ts")
			]),
		]),
	]),
	route("dashboard", "./routes/user/dashboard.tsx"),
	...prefix("settings", [route("profile", "./routes/user/profile.tsx")]),
	...prefix("files", [
		index("./routes/files.tsx"),
		route("new", "./routes/user/newFile.tsx"),
		route(":fileId/edit", "./routes/user/editFile.tsx"),
	]),
] satisfies RouteConfig;
