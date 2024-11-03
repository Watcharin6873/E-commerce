import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import useEcomStore from '../../store/ecom-store';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const navigate = useNavigate()
  const actionLogin = useEcomStore((state)=>state.actionLogin)
  const user = useEcomStore((state)=>state.user)
  console.log('user form zudtand: ', user)

  const [form, setForm] = useState({
    email:"",
    password:""
  })

  const handleOnchange = (e) =>{
    setForm({
      ...form, 
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    try {
      const res = await actionLogin(form)
      toast.success('Welcome Back!')
      const role = res.data.payload.role
      roleRedirect(role)
    } catch (err) {
      const errMsg = err.response.data.message
      toast.error(errMsg)
    }
  }

  const roleRedirect = (role) =>{
    if(role === 'admin'){
      navigate('/admin')
    }else{
      navigate('/user')
    }
  }


  return (
    <div>
      Login
      <form onSubmit={handleSubmit}>
        Email
        <input
          className='border'
          onChange={handleOnchange}
          name='email'
          type='email'
        />
        Password
        <input
          className='border'
          onChange={handleOnchange}
          name='password'
          type='text'
        />
        <button
          className='bg-blue-500 rounded-md'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login