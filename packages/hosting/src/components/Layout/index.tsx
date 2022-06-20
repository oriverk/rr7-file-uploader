import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from './Header'
import { Footer } from './Footer'

export const Layout: FC = () => (
  <>
    <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <Header />
      </div>
    </div>
    <Outlet />
    <Footer />
  </>
)