import { FC, ReactNode } from 'react'

interface Props {
  className?: string;
  children: ReactNode
}

export const Container: FC<Props> = (props) => {
  const { className = "", children } = props
  
  return (
    <section className={`bg-white py-6 sm:py-8 lg:py-12 ${className}`}>
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        {children}
      </div>
    </section>
  )
}