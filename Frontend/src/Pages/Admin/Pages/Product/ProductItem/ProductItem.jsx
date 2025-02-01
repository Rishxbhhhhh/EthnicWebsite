import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, Typography, Button, IconButton, TextField, Hidden } from "@mui/material";
import { FaTimes, FaCheck } from "react-icons/fa";
import { AddAPhoto, DeleteForever } from '@mui/icons-material'
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from '@mui/icons-material/EditNote';
import Slider from "react-slick";
import axios from "axios";
import "./ProductItem.css";
import { Route } from "react-router-dom";
import noImageFound from "../../../../../assets/images/noProductImage.png"

const ProductItem = ({ product, onDelete, isAdmin, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState();
  const [editableFields, setEditableFields] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    mrp: product.mrp,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);// Track the current image index
  const componentRef = useRef(null);// Ref for the component
  //Sliders settings
  const settings = {
    dots: true,
    infinite: false, // Disable infinite scrolling
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setCurrentImageIndex(next), // Update the current image index
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  //API CALL TO DELETE PRODUCT
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the product: ${product.name}?`);
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:8080/products/delete/${product._id}`);
      alert("Product deleted successfully!");
      onDelete?.(product._id);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  //API CALL TO DELETE SELECTED IMAGE
  const handleDeleteImage = async () => {
    console.log("Libne 66",product._id)
    const imageToDelete = product.images[currentImageIndex];
    if (!imageToDelete || imageToDelete.publicId === "temp") {
      alert("Cannot delete an image that is not uploaded yet.");
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete this image?`);
    if (!confirmDelete) return;

    const updatedPublicId = imageToDelete.publicId.replace("products/", "");
    try {
      console.log(`Deleting image with publicId: ${updatedPublicId}`);
      await axios.delete(`http://localhost:8080/products/delete-image/${updatedPublicId}`);

      // Update state after successful deletion
      // Create the updated product
      const updatedImages = product.images.filter((_, index) => index !== currentImageIndex);
      const updatedProduct = { ...product, images: updatedImages };

      // Notify parent component
      onUpdate(product._id, updatedProduct);
      setCurrentImageIndex(0); // Reset index after deletion
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete the image. Please try again.");
    }
  };

  //ADD NEW IMAGES TO THE PRODUCT
  const handleAddImages = async (e,id) => {
    e.preventDefault();
    console.log("Debugger----->",id);

    const selectedImage = e.target.files[0];
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    const previewUrl = URL.createObjectURL(selectedImage);
    const tempImage = { publicId: "temp", url: previewUrl }; // Temporary image object
    
    // Optimistically UI update karo
    onUpdate(product._id, { ...product, images: [...product.images, tempImage] });
    console.log(product._id)

    const formData = new FormData();
    formData.append("images", selectedImage);

    try {
      const response = await axios.put(
       `http://localhost:8080/products/update/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }}
      );

      alert("Image uploaded successfully!");
      onUpdate(response.data._id, response.data); // Backend data se update k
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");

      // Optimistic update  revert 
      const updatedImages = product.images.filter((img) => img.publicId !== "temp");
      onUpdate(product._id, { ...product, images: updatedImages });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prevFields) => ({ ...prevFields, [name]: value, }));
  };

  //API: UPDATE EDITABLEFIELD DATA TO TO BACKEND 
  const handleSaveClick = async () => {
    try {
      console.log("Debugger----->",product._id)
      const response = await axios.put(
        `http://localhost:8080/products/update/${product._id}`,
        editableFields,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Product saved successfully!");
      // Call onUpdate with updated product data
      onUpdate(response.data._id, response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error while saving data:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  // REVERT TO ORIGNAL EDITABLEFIELD DATA AND CANCELS 
  const handleCancelClick = () => {
    setEditableFields({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
    });
    setIsEditing(false);
  };

  return (
    <Card ref={componentRef}
      sx={{
        maxWidth: 345,
        margin: 2,
        cursor: !isAdmin ? 'pointer' : 'default',
      }}
      onClick={!isAdmin ? console.log('true') : undefined}
      >
      <div style={{ position: "relative" }}>
        {product.images.length > 0 ? (
          <Slider {...settings} key={product.images.length}>
            {product.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url || "/placeholder.png"}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (<img src={noImageFound} style={{width:'100%'}}></img>)}

        {isAdmin && (
          <Button
            onClick={handleDeleteImage}
            className="deleteImageButton"
            variant="contained"
            color="error"
          >
            <DeleteForever />
          </Button>
        )}
        {isAdmin && (
          <div className="addImageButton">
            <input
              key={product._id}
              accept="image/"
              id={`upload-button${product._id}`}
              type="file"
              onChange={(e) => handleAddImages(e,product._id)}
              style={{ display: 'none' }}
            />
            <label htmlFor={`upload-button${product._id}`}>
              <Button
                variant="contained"
                component="span"
                className="upload-new-file-btn"
              >
                <AddAPhoto />
              </Button>
            </label>
          </div>
        )}
      </div>
      <CardContent className="productContent" sx={{ paddingTop: !isAdmin ? '20px' : '0px' }}>
        {isEditing && isAdmin ? (
          <>
            <TextField
              name="name"
              label="Name"
              value={editableFields.name}
              onChange={handleFieldChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={editableFields.description}
              onChange={handleFieldChange}
              fullWidth
              margin="normal"
              multiline
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={editableFields.price}
              onChange={handleFieldChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="mrp"
              label="MRP"
              type="number"
              value={editableFields.mrp}
              onChange={handleFieldChange}
              fullWidth
              margin="normal"
            />
            <IconButton onClick={handleSaveClick} title="Save">
              <FaCheck />
            </IconButton>
            <IconButton onClick={handleCancelClick} title="Cancel">
              <FaTimes />
            </IconButton>
          </>
        ) : (
          <div style={{ padding: '0px' }}>
            <Typography
              className="productName"
              gutterBottom
              variant="h5"
              component="div"
            >
              {editableFields.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editableFields.description}
            </Typography>
            <Typography variant="body2" color="text.primary">
              Price: ₹{editableFields.price} |{" "}
              <span style={{ textDecoration: "line-through", color: "gray" }}>
                ₹{editableFields.mrp}
              </span>
            </Typography>
            {
              !isAdmin && (
                <div>
                  <Button className="products-button">Add to Cart</Button>
                  <Button className="products-button">Buy Now</Button>
                </div>
              )
            }
            {isAdmin && (
              <div>
                {!isEditing && (
                  <Button
                    onClick={handleEditClick}
                    startIcon={<EditNoteIcon />}
                    color="primary"
                    variant="contained"
                    sx={{ mt: 2 }}
                    className="ProductOpsButton"
                  ></Button>
                )}
                <Button
                  onClick={handleDelete}
                  startIcon={<DeleteForeverIcon />}
                  color="error"
                  variant="contained"
                  sx={{ mt: 2, float: "right" }}
                  className="ProductOpsButton"
                ></Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductItem;

