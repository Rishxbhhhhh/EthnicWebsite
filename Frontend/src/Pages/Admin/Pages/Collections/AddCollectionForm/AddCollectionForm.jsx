import React, { useState } from 'react';
import './AddCollectionForm.css'
import { Button, IconButton, Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import PreviewIcon from '@mui/icons-material/Visibility';

const AddCollectionForm = ({ onAddCollection }) => {
  const [collectionName, setCollectionName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCancelButton, setShowCancelButton] = useState(false);  // Track the visibility of the cancel button

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);  // Optionally clear the file state
    setShowCancelButton(false);  // Hide cancel button after removing image
  };

  const handlePreviewClick = () => {
    setShowCancelButton(prevState => !prevState);  // Toggle cancel button visibility
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('name', collectionName);
    formData.append('image', file);

    onAddCollection(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="add-collection-form">
      <h2>Add New Collection</h2>
      <div className="form-content">
        {/* Collection Name Input */}
        <input
          className="collection-name-input"
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="Collection Name"
          required
        />

        {/* File Upload Button */}
        <input
          accept="image/*"
          id="upload-button"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="upload-button">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            className="upload-file-btn"
          >
            Choose File(s)
          </Button>
        </label>


        {/* Image Preview and Cancel Button */}
        {file && preview && (
          <Box className="image-preview-box">
            <div className="preview-image-container">
              <img
                src={preview}
                alt="Preview"
                className="image-preview"
              />
              <IconButton onClick={handleRemoveImage} className="remove-image-btn m-2">
                <DeleteForeverTwoToneIcon />
              </IconButton>
            </div>
          </Box>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          type="submit"
          className="submit-btn"
        >
          Upload
        </Button>
      </div>
    </form>
  );
};

export default AddCollectionForm;
