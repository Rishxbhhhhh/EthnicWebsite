import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCollections, addCollection, deleteCollectionById, updateCollectionById } from '../../../../Redux/Store/slices/collectionSlice';
import CollectionItem from './CollectionItem/CollectionItem';
import AddCollectionForm from './AddCollectionForm/AddCollectionForm';
import SearchBox from '../../../../Component/Header/SearchBox/SearchBox';
import "./Collections.css";
import { Button } from '@mui/material';

const ExploreEthnic = () => {
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);
  
  const [formOpen, setformOpen] = useState(false)

  useEffect(() => {
    dispatch(getCollections());
  }, [dispatch]);

  const handleAddCollection = (data) => {
    // for (const [key, value] of data.entries()) {
    //   console.log(${key}:, value);
    // }
    dispatch(addCollection(data));
  }
  const handleDeleteCollection = (id) => dispatch(deleteCollectionById(id));
  const handleUpdateCollection = (id, data) => dispatch(updateCollectionById({ id, data }));

  return (
    <div>
      <h1>Collection</h1>
      <SearchBox/>
      <Button sx={{float:'right'}} className='addCollectionBox' onClick={()=> setformOpen(!formOpen)}>Add+</Button>
      {
        formOpen &&(
          <AddCollectionForm onAddCollection={handleAddCollection} />
        )
      }
      <div className="collection-container" >
        <div className='collection-row-header'>
          <h4 className='m-0'>Name</h4>
          <h4 className='m-0 mx-1'>Action</h4>
        </div>
        {collections.map((collection) => (
          <CollectionItem
            key={collection._id}
            collection={collection}
            onDelete={handleDeleteCollection}
            onUpdate={handleUpdateCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreEthnic;
