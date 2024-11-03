import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const Layout = () => {
    return (
        <>
            <MainNav />
            <main className='h-full px-4 mt-2 mx-auto'>
                <Outlet />
            </main>
        </>
    )
}

export default Layout