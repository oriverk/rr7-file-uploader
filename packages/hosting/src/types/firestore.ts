import type { Timestamp } from "firebase/firestore";

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

export interface FirestoreFileType {
  name: string;
  description: string;
  path: string;
  fullPath: string;
  size: number;
  contentType: string;
  downloaded: number;
  password: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

export interface FormData {
  name: string;
  description?: string;
  file: FileWithPreview[];
  password: string;
  downloaded: number;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}
