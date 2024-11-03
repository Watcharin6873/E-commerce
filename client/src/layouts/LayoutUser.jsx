import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutUser = () => {
  return (
    <>
        <h1>Nav</h1>
        <hr/>
        <Outlet />
    </>
  )
}

export default LayoutUser