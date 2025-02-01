import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "./Signup.css";
import { handleError, handleSuccess } from '../../utils';
import Logo from '../../assets/images/logo.png'

const Signup = () => {

  const [signupInfo, setSignupInfo] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstname,lastname, email, password} = signupInfo;
    if (!firstname || !email || !password) {
      return handleError('name, email and password are required')
    }
    try {
      const url = "http://localhost:8080/auth/signup"
      const response = await fetch(url,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
      const result = await response.json();
      console.log(signupInfo);
      const {success, message} = result;
      if(success){
        handleSuccess(message);
        setTimeout(()=>{
          navigate('/login');
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
      <h1 className='heading-one'>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <div className='main-login-block'>
          <label htmlFor='firstname'>Firstname</label>
          <input
            onChange={handleChange}
            type='text'
            name='firstname'
            autoFocus
            placeholder='Enter your firstname...'
            value={signupInfo.name}
          />
        </div>
        <div className='main-login-block'>
          <label htmlFor='lastname'>Lastname</label>
          <input
            onChange={handleChange}
            type='text'
            name='lastname'
            autoFocus
            placeholder='Enter your lastname...'
            value={signupInfo.lastname}
          />
        </div>
        <div className='main-login-block'>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            autoFocus
            placeholder='Enter your email...'
            value={signupInfo.email}
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
            value={signupInfo.password}
          />
        </div>
        <button className='signup-button' type='submit'>Signup</button>
        <span>Already have an account ?
          <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Signup;