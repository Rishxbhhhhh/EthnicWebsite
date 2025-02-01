import React from 'react';
import './error.css';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';

const Error = () => {
  return (
    <div className='container-fluid-error'>
        <h1 className='errorHead'>SORRY...<br/>We couldn't find the page</h1>
        <p>Try searching or go to <Button><Link to="/"> Home page</Link></Button></p>
    </div>
  )
}

export default Error;