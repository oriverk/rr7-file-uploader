import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  children: ReactNode;
}

export const Container: FC<Props> = (props) => {
  const { className, children } = props;

  return (
    <section>
      <div className={twMerge("mx-auto max-w-screen-2xl px-4 py-2 md:px-8", className)}>{children}</div>
    </section>
  );
};
