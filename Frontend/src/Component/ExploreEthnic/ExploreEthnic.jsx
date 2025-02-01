import React, { useEffect, useState } from 'react'
import './ExploreEthnic.css'
import Collections from '../Collections/Collections';

const ExploreEthnic = () => {
  const [isData, setIsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/collections');
        const data = await response.json();
        setIsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []); 

  return (
    <div>
      <div className='text-center m-4'>
        <h1 style={{ fontFamily: 'monospace' }}>EXPLORE ETHNIC</h1>
      </div>
      <div className="collections-container">
        {/* rendering */}
        {isData.map((collection, index) => (
          <Collections key={index} collection={collection} />
        ))}


        {/* <button onClick={() => addCollection({
        name: "New Collection",
        imageUrl: "https://example.com/images/new-collection.jpg",
        description: "Description for new collection"
        })}>
        Add New Collection
      </button> */}
      </div>
    </div>

  )
}

export default ExploreEthnic;