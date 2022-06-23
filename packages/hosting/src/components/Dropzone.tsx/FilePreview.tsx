import React, { FC } from 'react';

import { Close } from '../Icons';
import { ImageLightbox } from "../ImageLightBox"

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

interface FilePreviewProps {
  file: File;
  // eslint-disable-next-line no-unused-vars
  deleteFile: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, file: File) => void;
}

export const FilePreview: FC<FilePreviewProps> = (props) => {
  const { file, deleteFile } = props;

  const imagesType = ['image/png', 'image/jpg', 'image/jpeg'];

  return imagesType.includes(file.type) ? (
    <div key={file.name} className='relative aspect-w-3 aspect-h-2'>
      <ImageLightbox
        src={URL.createObjectURL(file)}
        alt={file.name}
        className='object-cover rounded-lg shadow-lg'
      />
      <button
        type="button"
        onClick={(e) => deleteFile(e, file)}
        className='absolute top-0 right-0 flex p-2 leading-none'
      >
        <Close className='w-6 h-6 fill-red-500 cursor-pointer' />
      </button>
    </div>
  ) : (
    <div key={file.name} className='flex px-3 py-2 rounded-lg shadow-lg'>
      <button
        type="button"
        onClick={(e) => deleteFile(e, file)}
        className='flex mr-2 leading-none'
      >
        <Close className='w-6 h-6 fill-red-500 cursor-pointer' />
      </button>
      {file.name}
    </div>
  );
};