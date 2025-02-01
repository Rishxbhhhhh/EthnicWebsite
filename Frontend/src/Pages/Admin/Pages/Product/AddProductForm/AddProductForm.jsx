import React, { useState } from "react";
import { IconButton, Button, TextField, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import axios from "axios";
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close'; // Cross icon
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import AddIcon from '@mui/icons-material/Add'; // Plus icon for adding more images


const AddProductForm = ({ collections, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mrp: "",
    price: "",
    stock: "",
    collection: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.collection) {
      alert("Please select a collection.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("mrp", formData.mrp);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("collection", formData.collection);

    images.forEach((image) => data.append("images", image));

    try {
      const response = await axios.post("http://localhost:8080/products/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      setFormData({ name: "", description: "", mrp: "", price: "", stock: "", collection: "" });
      setImages([]);
      onProductAdded(response.data); // Notify parent about the new product
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      alert("Failed to add product. Please try again.");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);  // Append new files to the list

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreview((prevPreviews) => [...prevPreviews, ...previewUrls]);  // Append new previews
  };

  // Handle removing a single image preview and file
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreview((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  // Handle canceling all images
  const handleCancelAllImages = () => {
    setImages([]);
    setPreview([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Product</h4>
      <FormControl fullWidth margin="normal">
        <InputLabel id="collection-label">Collection</InputLabel>
        <Select
          labelId="collection-label"
          name="collection"
          value={formData.collection}
          onChange={handleInputChange}
          required
        >
          {collections.map((collection) => (
            <MenuItem value={collection._id} key={collection._id}>
              {collection.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box fullwidth sx={{
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        margin: 'auto'
      }}
      >
        <div style={{ display: 'grid' }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            required />
          <TextField
           fullWidth
           label="MRP"
           name="mrp"
           type="number"
           value={formData.mrp}
           onChange={handleInputChange}
           margin="normal"
           required/>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            margin="normal"
            required />
          <TextField
            fullWidth
            label="Stock Quantity"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            margin="normal"
            required />
        </div>

        <div className="d-flex ">
          <p className='p-0 my-4 mx-4'>Select Image(s):</p>
          <input
            accept="image/*"
            id="upload-new-image"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple
          />
          <label htmlFor="upload-new-image">
            <Button
              className='uploadFile m-3'
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              sx={{
                padding: "8px 15px",
                fontSize: "16px",
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Choose File(s)
            </Button>
          </label>

        </div>

        {/* Cancel all images button */}
        {images.length > 0 && (
          <IconButton
            onClick={handleCancelAllImages}
            sx={{
              color: "red",
              backgroundColor: "#fff",
              float: 'right',
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <CloseIcon /> {/* Cross icon to cancel all images */}
          </IconButton>
        )}
        {/* Preview images */}
        {preview.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
            {preview.map((url, index) => (
              <div key={index} style={{ margin: '10px', display: "grid", justifyItems: 'center' }}>
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '10px' }}
                />
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    color: "black",
                    width: 'fit-content',
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <DeleteForeverTwoToneIcon />
                </IconButton>
              </div>
            ))}
            {/* Plus icon to add more images */}
            {images.length > 0 && (
              <IconButton
                onClick={() => document.getElementById("upload-new-image").click()}
                sx={{
                  color: "green",
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <AddIcon /> {/* Plus icon to add more images */}
              </IconButton>
            )}
          </Box>
        )}

        <Button
          variant="contained"
          type="submit"
          sx={{
            marginLeft: 'auto',
            marginTop: '10px',
            "&:hover": {
              backgroundColor: '#1b4061d8'
            }, float: 'right'
          }}
        >
          Upload
        </Button>
      </Box>
    </form>
  );
};

export default AddProductForm;
