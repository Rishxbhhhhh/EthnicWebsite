import React, { useEffect, useState } from 'react'
import '../Collections/Collections.css';

const Product = ({product}) => {

    return (
        <div>
            <div className="collection-item">
                <img src={product.images[0].url} alt={product} className="collection-image" />
                <h3 className='m-0 p-0'>{(product.name).toUpperCase()}</h3>
            </div>
        </div>
    )
}

export default Product