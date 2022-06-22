import React, { FC } from 'react'
import { useFormContext } from "react-hook-form"

// import { classNames } from "../../utils/classNames"

interface IProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string;
  label: string;
}

export const CheckBox: FC<IProps> = (props) => {
  const { label, id, readOnly, disabled, ...rest } = props
  const {
    register,
    // formState: { errors }
  } = useFormContext();

  // let stateClass;
  // if (readOnly || disabled) {
  //   stateClass = "bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300"
  // } else if (errors[id]) {
  //   stateClass = "focus:ring-red-500 border-red-500 focus:border-red-500"
  // } else {
  //   stateClass = "focus:ring-primary-500 border-gray-300 focus:border-primary-500"
  // }
  // const className = classNames(stateClass, "block w-full rounded-md shadow-sm")

  return (
    <div>
      <label htmlFor={id} className="inline-flex items-center w-full">
        <input
          type="checkbox"
          {...register(id)}
          {...rest}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          className="rounded border-gray-30 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <span className="ml-2">
          {label}
        </span>
      </label>
    </div>
  )
}