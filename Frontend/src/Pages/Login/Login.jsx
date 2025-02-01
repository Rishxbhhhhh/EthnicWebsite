import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import Logo from '../../assets/images/logo.png'

const Login = () => {

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const {email, password} = loginInfo;
    if (!email || !password) {
      return handleError('email and password are required')
    }
    try {
      const url = "http://localhost:8080/auth/login"
      const response = await fetch(url,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      console.log(loginInfo);
      const {success, message, jwtToken, name} = result;
      if(success){
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", name);
        setTimeout(()=>{
          navigate('/');
        },1000)
      }
    } catch (err) {
      handleError(err);
    }
  }
  return (
    <div className='main-container'>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <img className='logo' src={Logo} alt="logo" />
      </div>
      <h1 className='heading-one'>Login</h1>
      <form onSubmit={handleLogin}>
        <div className='main-login-block'>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            autoFocus
            placeholder='Enter your email...'
            value={loginInfo.email}
          />
        </div>
        <div className='main-login-block'>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            name='password'
            autoFocus
            placeholder='Enter your password...'
            value={loginInfo.password}
          />
        </div>
        <button className='signup-button' type='submit'>Login</button>
        <span>Dont have an account ?
          <Link to="/signup">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login;