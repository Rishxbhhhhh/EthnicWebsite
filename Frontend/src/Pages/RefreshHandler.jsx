import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RefreshHandler = ({setisAuthenticated}) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=> {
        if(localStorage.getItem('token')){
            setisAuthenticated(true);
            if(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup'){
                navigate('/home', {replace: false})
            }
        }
    }, [location,navigate,setisAuthenticated])
  return (
    <div></div>
  )
}
export default RefreshHandler