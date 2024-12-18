export const MAX_PROFILE_LENGTH = 140;
export const MAX_FILE_DESCRIPTION_LENGTH = 15000;
export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
export const CONTENT_TYPES: Record<string, string> = {
	"image/avif": "avif",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"application/zip": "zip",
	"application/x-zip-compressed": "zip",
};
export const ALLOWED_CONTENT_TYPES = [
	"application/zip",
	"application/x-zip-compressed",
];
export const ALLOWED_FILE_EXTENSIONS = ["zip"];
export const RESERVED_WORDS = [
	"join",
	"login",
	"logout",
	"dashboard",
	"settings",
	"files",
	"lorem",
	"privacy",
	"terms",
	"root",
	"signup",
	"admin",
	"account",
	"posts",
];
