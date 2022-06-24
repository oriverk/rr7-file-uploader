/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from "react"
import clsx from "clsx"
import { RegisterOptions, useFormContext } from "react-hook-form"
import { ExclamationCircleIcon } from "@heroicons/react/outline"

export interface IProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string;
  label: string;
  validation?: RegisterOptions;
  helperText?: string;
}

export const Input: FC<IProps> = (props) => {
  const {
    label, helperText = "", placeholder = "", id, type = "text", readOnly, disabled, validation, ...rest
  } = props
  const { register, formState: { errors } } = useFormContext();

  let stateClass;
  if (readOnly || disabled) {
    stateClass = 'bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
  } else if (errors[id]) {
    stateClass = "focus:ring-red-500 border-red-500 focus:border-red-500"
  } else {
    stateClass = "focus:ring-primary-500 border-gray-300 focus:border-primary-500"
  }
  const className = clsx(stateClass, "block w-full rounded-md shadow-sm")

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-normal text-gray-700'>
        {label}
      </label>
      <div className='relative mt-1'>
        <input
          {...register(id, validation)}
          {...rest}
          type={type}
          name={id}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          className={className}
          placeholder={placeholder}
          aria-describedby={id}
        />

        {errors[id] && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <ExclamationCircleIcon className='h-6 w-6 text-red-500' />
          </div>
        )}
      </div>
      <div className='mt-1'>
        {helperText && <p className='text-xs text-gray-500'>{helperText}</p>}
        {errors[id] && (
          <span className='text-sm text-red-500'>{errors[id].message}</span>
        )}
      </div>
    </div>
  );

}