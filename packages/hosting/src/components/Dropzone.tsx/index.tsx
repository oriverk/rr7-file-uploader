import React, { FC, useCallback } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';

import { classNames } from "../../utils/classNames"
import { FilePreview } from "./FilePreview"

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

interface DropzoneProps {
  id: string;
  label: string;
  accept: Accept;
  maxFiles?: number;
  helperText?: string;
  validation?: RegisterOptions
}

export const DragnDropInput: FC<DropzoneProps> = (props) => {
  const { id, label, accept, maxFiles = 1, helperText, validation } = props
  const { register, setValue, setError, clearErrors, watch, formState: { errors }, } = useFormContext();

  const files: File[] = watch(id)
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setValue(id, [])
        setError(id, {
          type: "manual",
          message: rejectedFiles && rejectedFiles[0].errors[0].message
        })
      } else {
        setValue(id, acceptedFiles, { shouldValidate: true })
        clearErrors(id)
      }
    },
    [id, setValue, setError, clearErrors]
  )

  const deleteFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, file: File) => {
    e.preventDefault()
    const newFiles = [...files];

    newFiles.splice(newFiles.indexOf(file), 1)

    if (newFiles.length > 0) {
      setValue(id, newFiles)
    } else {
      setValue(id, [])
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles
  })

  return (
    <>
      <label className='block text-sm font-normal text-gray-700' htmlFor={id}>
        {label}
      </label>

      {files?.length >= maxFiles ? (
        <div className='grid grid-cols-1 gap-2 mt-1'>
          {files.map((file) => (
            <FilePreview key={file.toString()} file={file} deleteFile={deleteFile} />
          ))}
        </div>
      ) : (
        <>
          <div className='mt-1' {...getRootProps()}>
            <input {...register(id, validation)} id={id} {...getInputProps()} />
            <div
              className={classNames(
                'w-full p-2 bg-gray-100 border border-gray-300 border-dashed rounded cursor-pointer',
                errors[id]
                  ? 'focus:ring-red-500 border-red-500 focus:border-red-500'
                  : 'focus:ring-dark-400 focus:border-dark-400'
              )}
            >
              <p className='my-20 text-center text-gray-500'>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>

              {!!files?.length && (
                <div className='grid grid-cols-1 gap-1 mt-2'>
                  {files.map((file) => (
                    <FilePreview
                      key={file.toString()}
                      file={file}
                      deleteFile={deleteFile}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className='mt-1'>
            {helperText !== '' && (
              <p className='text-xs text-gray-500'>{helperText}</p>
            )}
            {errors[id] && (
              <p className='text-sm text-red-500'>{errors[id].message}</p>
            )}
          </div>
        </>
      )}
    </>
  );
}