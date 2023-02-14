import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<'button'>

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { children, className, type = "button", disabled, onClick, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={
        twMerge(
          "w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:dark:bg-gray-600 sm:w-auto",
          className
        )
      }
      ref={ref}
    >
      {children}
    </button>
  );
});
