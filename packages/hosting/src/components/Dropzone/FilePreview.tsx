/* eslint-disable no-unused-vars */
import { FC, MouseEvent } from "react";
import { PaperClipIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

import type { FileWithPreview } from "@/types/firestore";

type FilePreviewProps = {
  file: FileWithPreview;
} & (
  | {
      deleteFile?: (e: MouseEvent, file: FileWithPreview) => void;
      readOnly?: true;
    }
  | {
      deleteFile: (e: MouseEvent, file: FileWithPreview) => void;
      readOnly?: false;
    }
);

export const FilePreview: FC<FilePreviewProps> = (props) => {
  const { deleteFile, file, readOnly } = props;

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    deleteFile?.(e, file);
  };

  const imagesType = ["image/png", "image/jpg", "image/jpeg"];

  return imagesType.includes(file.type) ? (
    <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm" key={file.name}>
      <div className="flex w-0 flex-1 items-center">
        <PhotoIcon className="h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
        <span className="ml-2 w-0 flex-1 truncate">{file.name}</span>
      </div>
      <div className="ml-4 flex flex-shrink-0 items-center space-x-2">
        {!readOnly && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded text-xl font-medium text-red-500 hover:text-red-700 focus:outline-none focus:ring focus:ring-red-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </li>
  ) : (
    <li key={file.name} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
      <div className="flex w-0 flex-1 items-center">
        <PaperClipIcon className="h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
        <span className="ml-2 w-0 flex-1 truncate">{file.name}</span>
      </div>
      <div className="ml-4 flex flex-shrink-0 items-center space-x-2">
        {!readOnly && (
          <button
            className="cursor-pointer rounded text-red-500 hover:text-red-700 focus:outline-none focus:ring focus:ring-red-500"
            type="button"
            onClick={(e) => deleteFile?.(e, file)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </li>
  );
};
