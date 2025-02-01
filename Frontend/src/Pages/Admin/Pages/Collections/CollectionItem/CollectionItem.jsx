import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, Modal, Button } from '@mui/material';
import { FaTimes, FaCheck, FaEdit } from "react-icons/fa";
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import PreviewIcon from '@mui/icons-material/Visibility';
import './CollectionItem.css';

const CollectionItem = ({ collection, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(collection.name);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const editRef = useRef(null); // Create ref for the edit section

  // Close the edit input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setIsEditing(false); // Close edit mode if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleNameChange = (e) => setUpdatedName(e.target.value);

  const handleSaveClick = () => {
    onUpdate(collection._id, { name: updatedName });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUpdatedName(collection.name);
  };

  const handleDeleteClick = () => onDelete(collection._id);

  // Modal 
  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUpdateImage = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      onUpdate(collection._id, formData);
      alert('Collection added.');
      setSelectedFile(null);
      setPreviewUrl(null);
      setOpenModal(false);
    } else {
      alert('Please select an image first.');
    }
  };

  return (
    <div className="collection-row-data">
      {isEditing ? (
        <div ref={editRef} className="d-flex align-items-center">
          <input
            type="text"
            value={updatedName}
            onChange={handleNameChange}
            className="input-summary form-control border-bottom me-2"
            placeholder="Edit collection name..."
            autoFocus
          />
          <IconButton onClick={handleSaveClick} title="Save">
            <FaCheck />
          </IconButton>
          <IconButton onClick={handleCancelClick} title="Cancel">
            <FaTimes />
          </IconButton>
        </div>
      ) : (
        <Typography className="collectionName" onClick={handleEditClick}>
          {collection.name}
        </Typography>
      )}
      <Box>
        <IconButton onClick={handleOpenModal}>
          <PreviewIcon style={{ color: '#414141' }} />
        </IconButton>
        <IconButton onClick={handleDeleteClick}>
          <DeleteForeverTwoToneIcon style={{ color: '#414141' }} />
        </IconButton>
      </Box>

      {/* Modal for Image Preview and Update */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="imagePreviewModal">
          {collection.images?.[0] && (
            <img
              src={collection.images[0]}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          )}
          <p className="fw-bold">Replace Image:</p>
          <input
            id="replace-image-input"
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="replace-image-input" className='d-flex justify-content-between'>
            <Button
              variant="contained"
              component="span"
              startIcon={<FaEdit />}
            >
              Choose File
            </Button>
            {previewUrl && (
              <div className='d-flex'>
                <Box className='previewSelectedImageBox'>
                  <img src={previewUrl} alt="Updated Preview" style={{width:'70px'}} />
                </Box>
                <IconButton onClick={handleRemoveImage}
                  sx={{ background: "white !important" }}>
                  <DeleteForeverTwoToneIcon />
                </IconButton>
              </div>
            )}
            <Button
              variant="contained"
              onClick={handleUpdateImage}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </label>
        </Box>
      </Modal>
    </div>
  );
};

export default CollectionItem;
