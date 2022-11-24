import type { DetailedHTMLProps, ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import clsx from "clsx";

interface IProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: ReactNode;
}
type Ref = HTMLButtonElement;

export const Button = forwardRef<Ref, IProps>((props, ref) => {
  const { children, className, type = "button", disabled, onClick, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={clsx(
        className,
        "w-full rounded-lg disabled:cursor-not-allowed bg-blue-700 disabled:bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 disabled:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 disabled:dark:bg-gray-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      )}
      ref={ref}
    >
      {children}
    </button>
  );
})
