import type { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Table: FC<Props> = ({ children, className }) => (
  <table className={twMerge("text-left text-sm text-gray-500 dark:text-gray-400", className)}>{children}</table>
);

export const Thead: FC<Props> = ({ children, className }) => (
  <thead className={twMerge("bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400", className)}>
    {children}
  </thead>
);

export const Th: FC<Props & { scope?: string; title?: string }> = ({ children, className, ...rest }) => (
  <th className={twMerge("px-6 py-3", className)} {...rest}>
    {children}
  </th>
);

export const Td: FC<Props> = ({ children, className }) => (
  <td className={twMerge("whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white", className)}>
    {children}
  </td>
);
