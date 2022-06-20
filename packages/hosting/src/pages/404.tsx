import { FC } from 'react'
import { Container } from '../components/Container'

export const PageNotFound: FC = () => (
  <Container>
    <div className="min-h-96 flex flex-col justify-center items-center flex-1 shrink-0 bg-gray-100 overflow-hidden shadow-lg rounded-lg relative py-16 md:py-20 xl:py-48">
      <h1 className="text-7xl">404</h1>
      <p className='text-4xl'>Page Not Found</p>
    </div>
  </Container>
)