import React, { FC, ReactNode } from "react";

import { classNames } from "../../utils/classNames";

interface IProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  children: ReactNode
}

export const Button: FC<IProps> = (props) => {
  const { children, className = "", type = "button", onClick, ...rest } = props
  
  return (
    <button
      {...rest}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={classNames(className, "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800")}
    >
      {children}
    </button>
  )
}