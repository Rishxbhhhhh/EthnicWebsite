import React from 'react'
import './SearchBox.css';
import Button from '@mui/material/Button';
import { IoSearch } from 'react-icons/io5';

const SearchBox = () => {
    return (
        <div className='headerSearch d-flex ml-3 mr-3'>
            <input type='text' placeholder='Search here...' />
            <Button><IoSearch/></Button>
        </div>
    )
}

export default SearchBox