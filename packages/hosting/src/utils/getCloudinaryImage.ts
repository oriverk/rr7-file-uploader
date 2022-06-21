/* eslint-disable no-console */
const baseUrl = 'https://res.cloudinary.com';

const CloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME

/**
 * Cloudinaryに保存されている画像のフルURLを生成する
 * @param filepath
 * @param version
 * @returns
 */
export function getCloudinaryImage(filepath: string, version?: number) {
  // filepath: "folderName/imageName.mediaType"
  // like: "foo/bar.jpg"

  if (!filepath) {
    console.log('filename for resource is required.');
    return '';
  }
  if (!CloudinaryName) {
    console.log('cloudinary name is requied but missing.');
    return '';
  }

  const url = `${baseUrl}/${CloudinaryName}/image/upload/${version ? `v${version}/` : ''}${filepath}`;

  return url;
}