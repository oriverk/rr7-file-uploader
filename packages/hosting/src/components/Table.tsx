import type{ FC, ReactNode } from "react"
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
}

export const Table: FC<Props> = ({ children, className }) => (
  <table className={clsx(className, "text-left text-sm text-gray-500 dark:text-gray-400")}>
    {children}
  </table>
)

export const Thead: FC<Props> = ({ children, className }) => (
  <thead className={clsx(className, "bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400")}>
    {children}
  </thead>
)

export const Th: FC<Props & { scope?: string; title?: string; }> = ({ children, className, ...rest }) => (
  <th className={clsx(className, "px-6 py-3")} {...rest}>
    {children}
  </th>
)

export const Td: FC<Props> = ({ children, className }) => (
  <td className={clsx(className, "whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white")}>
    {children}
  </td>
)