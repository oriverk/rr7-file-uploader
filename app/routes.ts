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
	route("logout", "./routes/auth/logout.ts"),

	route("lorem", "./routes/lorem.tsx"),
	route("privacy", "./routes/privacy.tsx"),
	route("terms", "./routes/terms.tsx"),

	...prefix(":username", [
		index("./routes/userFiles.tsx"),
		...prefix("files/:fileId", [
			index("./routes/fileDetail.tsx"),
			route("download", "./routes/fileDownload.ts"),
		]),
	]),
	route("dashboard", "./routes/user/dashboard.tsx"),
	...prefix("settings", [route("profile", "./routes/user/editProfile.tsx")]),
	...prefix("files", [
		index("./routes/files.tsx"),
		route("new", "./routes/user/createFile.tsx"),
		// route("naw", "./routes/user/createFileX.tsx"),
		route(":fileId/edit", "./routes/user/editFile.tsx"),
	]),
] satisfies RouteConfig;
