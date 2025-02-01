import React, { useEffect, useState } from 'react'
import Product from "../Products/Product";

const NewArrivals = () => {
    const [isData, setIsData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/products');
                const data = await response.json();
                setIsData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    
    console.log("Line 13:", isData);


    return (
        <div>
            <div className='text-center m-4'>
                <h1 style={{ fontFamily: 'monospace' }}>NEW ARRIVALS</h1>
            </div>
            <div className='collection-container'>
                {isData.map((product, index) => (
                    <Product key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default NewArrivals