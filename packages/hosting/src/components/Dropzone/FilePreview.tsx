/* eslint-disable no-unused-vars */
import { FC, MouseEvent } from 'react';

import {
  PaperClipIcon,
  PhotographIcon,
  XIcon
} from "@heroicons/react/outline"

import { FileWithPreview } from "../../types/firestore"

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

  const imagesType = ['image/png', 'image/jpg', 'image/jpeg'];

  return imagesType.includes(file.type) ? (
    <li
        className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'
        key={file.name}
      >
        <div className='flex items-center flex-1 w-0'>
          <PhotographIcon
            className='flex-shrink-0 w-6 h-6 text-gray-400'
            aria-hidden='true'
          />
          <span className='flex-1 w-0 ml-2 truncate'>{file.name}</span>
        </div>
        <div className='flex items-center flex-shrink-0 ml-4 space-x-2'>
          {!readOnly && (
            <button
              type='button'
              onClick={handleDelete}
              className='text-xl font-medium text-red-500 rounded focus:ring focus:ring-red-500 focus:outline-none hover:text-red-700'
            >
              <XIcon className='w-6 h-6' />
            </button>
          )}
        </div>
      </li>
  ) : (
    <li
      key={file.name}
      className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'
    >
      <div className='flex items-center flex-1 w-0'>
        <PaperClipIcon
          className='flex-shrink-0 w-6 h-6 text-gray-400'
          aria-hidden='true'
        />
        <span className='flex-1 w-0 ml-2 truncate'>{file.name}</span>
      </div>
      <div className='flex items-center flex-shrink-0 ml-4 space-x-2'>
        {!readOnly && (
          <button
            className='text-red-500 rounded cursor-pointer hover:text-red-700 focus:ring focus:ring-red-500 focus:outline-none'
            type='button'
            onClick={(e) => deleteFile?.(e, file)}
          >
            <XIcon className='w-6 h-6' />
          </button>
        )}
      </div>
    </li>
  );
};