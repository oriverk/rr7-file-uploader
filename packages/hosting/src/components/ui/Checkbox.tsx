import type { ComponentProps, FC } from "react";

type Props = ComponentProps<"input"> & {
  label: string;
};

export const Checkbox: FC<Props> = (props) => {
  const { id, label, ...rest } = props;
  return (
    <label
      htmlFor={id}
      className="ml-2 flex items-center justify-center text-base font-medium text-gray-900 dark:text-gray-300"
    >
      <input
        type="checkbox"
        name={id}
        id={id}
        // checked={isConfirmed}
        // onChange={handleConfirm}
        className="mr-4 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        {...rest}
      />
      {label}
    </label>
  );
};
