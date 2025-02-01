import React from 'react';
import './Collections.css'

const Collections = ({ collection }) => {
  return (
    <div className="collection-item">
      <img src={collection.images} alt={collection.name} className="collection-image" />
      <h3 className='m-0 p-0'>{(collection.name).toUpperCase()}</h3>
    </div>
  );
};

export default Collections;
