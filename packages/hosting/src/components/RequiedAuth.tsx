import { FC, ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../lib/firebase'
import { Container } from './Container'

interface Props {
  children: ReactNode
}

// @ts-ignore
export const RequiredAuth: FC<Props> = (props) => {
  const { children } = props;
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation()

  if (error || loading) {
    return (
      <Container>
        <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">
          Authentication
        </h2>
        <div className="p-4 md:p-8 mx-auto max-w-lg border rounded-lg text-center">
          {error && (<strong className="text-red-500">{`Error: ${error}`}</strong>)}
          {loading && (<p>Loading...</p>)}
        </div>
      </Container>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
  
}