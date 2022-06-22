import React, { FC, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Visibility, VisibilityOff } from '../Icons';
import { classNames } from "../../utils/classNames"

interface IProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string;
  label: string;
  validation: any;
  helperText?: string;
}

export const PasswordInput: FC<IProps> = (props) => {
  const {
    label,
    placeholder = '',
    helperText = '',
    id,
    disabled = false,
    readOnly = false,
    validation,
    ...rest
  } = props

  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  let stateClass;
  if (readOnly || disabled) {
    stateClass = "bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300"
  } else if (errors[id]) {
    stateClass = "focus:ring-red-500 border-red-500 focus:border-red-500"
  } else {
    stateClass = "focus:ring-primary-500 border-gray-300 focus:border-primary-500"
  }

  const className = classNames(stateClass, "block w-full rounded-md shadow-sm")

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-normal text-gray-700'>
        {label}
      </label>
      <div className='relative mt-1'>
        <input
          {...register(id, validation)}
          {...rest}
          type={showPassword ? 'text' : 'password'}
          name={id}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          className={className}
          placeholder={placeholder}
          aria-describedby={id}
        />

        <button
          type="button"
          onClick={togglePassword}
          className='absolute inset-y-0 right-0 flex items-center p-1 mr-3 rounded-lg focus:outline-none focus:ring focus:ring-primary-500'
        >
          {showPassword ? (
            <VisibilityOff className='cursor-pointer w-6 h-6' />
          ) : (
            <Visibility className='cursor-pointer w-6 h-6' />
          )}
        </button>
      </div>
      <div className='mt-1'>
        {helperText !== '' && (
          <p className='text-xs text-gray-500'>{helperText}</p>
        )}
        {errors[id] && (
          <span className='text-sm text-red-500'>{errors[id].message}</span>
        )}
      </div>
    </div>
  );
}