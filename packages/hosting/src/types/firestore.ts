// import { FileWithPath } from "react-dropzone"

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

export interface FileWithPath extends File {
  readonly path?: string;
}

export interface FileWithPreview extends FileWithPath {
  preview: string;
}

export interface FirestoreType {
  name: string;
  path: string;
  size: number;
  type: string;
  downloaded: number;
  deleted: Date | null;
  createdAt: Date;
}

export interface FormData {
  name: string;
  description?: string;
  file: FileWithPreview[];
  password: string;
  downloaded: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
