import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'rc-slider/assets/index.css';

const App = () => {


  return (
    <>
    <ToastContainer />
      <AppRoutes />
    </>

  )
}

export default App