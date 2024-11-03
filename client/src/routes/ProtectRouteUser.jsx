import React, { useState, useEffect } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentUser } from '../api/Auth'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteUser = ({ element }) => {
    const user = useEcomStore((state) => state.user)
    const token = useEcomStore((state) => state.token)
    const [ok, setOk] = useState(false)

    useEffect(() => {
        if (user && token) {
            //send to back
            currentUser(token)
                .then(res=>{
                    setOk(true)
                })
                .catch(err=>{
                    setOk(false)
                })
        }
    }, [])


    return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteUser