import React, { useEffect, useState } from "react";
import axios from "axios";
import "./allMain.css";
import { Button, TextField, Box, IconButton, Modal, Typography } from "@mui/material";
import { FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import UploadIcon from "@mui/icons-material/Upload";
import SearchBox from "../../../Component/Header/SearchBox/SearchBox";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";

const Corousel = () => {
  const [categoryName, setCategoryName] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [replacedFile, setreplacedFile] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [updatedPreview, setUpdatedPreview] = useState(null);

  const [slides, setSlides] = useState([]);
  const [file, setFile] = useState(null);

  const [editingId, setEditingId] = useState(null); // Track which item is being edited
  const [deleteId, setDeleteId] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/category");
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleNameChange = (e, id) => {
    const updatedName = e.target.value;

    setSlides((prevSlides) =>
      prevSlides.map((slide) =>
        slide._id === id ? { ...slide, name: updatedName } : slide
      )
    );
  };

  //updating name in corousel PUT
  const handleSaveClick = async (id, updatedName) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/category/update/${id}`,
        { name: updatedName },
        { headers: { "Content-Type": "application/json", } }
      );

      if (response.status === 200) {
        alert("Category updated successfully!");
        setEditingId(null);

        setSlides((prevSlides) =>
          prevSlides.map((slide) =>
            slide._id === id ? { ...slide, name: updatedName } : slide
          )
        );
      }
    } catch (error) {
      console.error(
        "Error updating Category:",
        error.response?.data || error.message
      );
      alert("Failed to update the Category. Please try again.");
    }
  };

  // name edit canceling
  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeletePopupOpen(true);
  };

  // alert Modal
  const handleCancelDelete = () => {
    setDeleteId(null);
    setIsDeletePopupOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/category/delete/${deleteId}`
      );

      if (response.status === 200) {
        alert("Category deleted successfully!");
        setSlides((prevSlides) =>
          prevSlides.filter((slide) => slide._id !== deleteId)
        );
      }
    } catch (error) {
      console.error(
        "Error deleting Category:",
        error.response?.data || error.message
      );
      alert("Failed to delete the Category. Please try again.");
    } finally {
      setDeleteId(null);
      setIsDeletePopupOpen(false);
    }
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:8080/category/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data", } }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  const handleOpenModal = (id, image) => {
    setOpenModal(true);
    if (openModal === false) {
      setEditingId(id);
    }
    setModalImage(image);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalImage(null);
  };

  const handleAddButton = () => {
    setIsAddOpen(!isAddOpen);
  };

  const handleUpdatedFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    setreplacedFile(selectedFile);
    const replacedPreviewUrl = URL.createObjectURL(selectedFile);
    setUpdatedPreview(replacedPreviewUrl);

    console.log("File selected for replacement:", selectedFile);
  };

  const handleUpdateImage = async (id) => {
    console.log(id)

    if (!replacedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('image', replacedFile);

    try {
      const response = await axios.put(`http://localhost:8080/category/update/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', } }
      );
      console.log('Image updated successfully:', response.data);
      alert('Image updated successfully!');

      // Refresh collection list
      const updatedResponse = await axios.get('http://localhost:8080/category');
      setSlides(updatedResponse.data);
      setUpdatedPreview(null);
      setreplacedFile(null);
      setEditingId(null)
    } catch (error) {
      console.error('Error updating image:', error.response?.data || error.message);
      alert('Failed to update the image. Please try again.');
    }
  };

  return (
    <div>
      <h1>Corousel Update</h1>
      <div className="options-containers d-flex justify-content-between">
        <SearchBox />
        <Button className="addCorouselBox" onClick={handleAddButton}>Add+</Button>
      </div>
      {isAddOpen && (
        <form onSubmit={handleSubmit}>
          <h4 className="mt-3">Add new Corousel</h4>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: 800,
              margin: "auto",
            }}
          >
            <TextField
              label="Description name"
              variant="outlined"
              margin="normal"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
            <p className="p-0 m-0">Select Image:</p>
            <input
              accept="image/*"
              id="upload-button"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="upload-button">
              <Button
                variant="contained"
                className="uploadFile"
                component="span"
                startIcon={<UploadIcon />}
                sx={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Choose File
              </Button>
            </label>
            {/* Image Preview */}
            {preview && (
              <Box
                sx={{
                  maxWidth: "70px",
                  maxHeight: "70px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}

            {/* Remove Button */}
            {preview && (
              <IconButton
                onClick={handleRemoveImage}
                color="secondary"
                sx={{
                  color: "black",
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <DeleteForeverTwoToneIcon />
              </IconButton>
            )}
            {/* Upload Submit Button */}
            <Button
              variant="contained"
              type="submit"
              // color="primary"
              sx={{
                marginLeft: "auto",
                "&:hover": {
                  backgroundColor: "#1b4061d8",
                },
              }}
            >
              Upload
            </Button>
          </Box>
        </form>
      )}

      <div className="carousel-container">
        {slides && slides.length > 0 ? ( // Only render carousel if slides are not empty
          <div className="carousel-data">
            <div className="carousel-row-header">
              <h4 className="m-0">Type</h4>
              <h4 className="m-0 mx-5">Action</h4>
            </div>
            {slides.map((slide, index) => (
              <div className="corousel-row-data" key={slide._id}>
                {editingId === slide._id ? (
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      value={slide.name}
                      onChange={(e) => handleNameChange(e, slide._id)}
                      className="input-summary form-control border-bottom me-2"
                      placeholder="Edit Category name..."
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveClick(slide._id, slide.name)}
                      className="btn btn-success btn-sm me-2 m-0 edit-button"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="btn btn-danger btn-sm m-0 edit-button"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <Typography
                    sx={{
                      fontWeight: "600",
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => handleEditClick(slide._id)}
                  >
                    {slide.name}
                  </Typography>
                )}
                <div className="inner-image-container">
                  {/* Remove Button */}
                  <img
                    onClick={() => handleOpenModal(slide._id, slide.images[0])}
                    src={slide.images[0]} // Use the first image from the category's images
                    alt={slide.name}
                    className="carousel-image"
                    style={{ width: "10%" }}
                  />
                 
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(slide._id)}
                    sx={{
                      color: "black",
                      backgroundColor: "#fff",
                      marginInline: "10px",
                      width: "max-content",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <DeleteForeverTwoToneIcon />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No categories available</p> // Fallback message when slides are empty
        )}
      </div>

      {/* Modal for Image Preview */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
          }}
        >
          {modalImage && (
            <img
              src={modalImage}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
          <p className='p-0 m-0 fw-bold'>Replace Image:</p>
          <input
            accept="image/*"
            id="replace-button"
            type="file"
            onChange={handleUpdatedFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="replace-button" className='d-flex justify-content-between'>
            <Button
              className='uploadFile'
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
            >
              Choose File
            </Button>
            {updatedPreview && (
              <Box
                sx={{
                  maxWidth: '70px',
                  maxHeight: '70px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={updatedPreview}
                  alt="updatedPreview"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </Box>
            )}
            {updatedPreview && (
              <IconButton onClick={handleRemoveImage}
                sx={{ background: "white !important" }}>
                <DeleteForeverTwoToneIcon />
              </IconButton>
            )}
            <Button
              variant="contained"
              type="button"
              onClick={() => handleUpdateImage(editingId)} // Passing the ID being edited
              sx={{
                marginLeft: 'auto',
                "&:hover": {
                  backgroundColor: '#1b4061d8'
                },
              }}
            >
              Upload
            </Button>

          </label>
        </Box>
      </Modal>

      <Modal open={isDeletePopupOpen} onClose={handleCancelDelete}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this Category?
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button
              variant="contained"
              sx={{
                background: "white",
                color: "black",
                ":hover": {
                  background: "#db5f4f",
                  color: "white",
                },
              }}
              color="error"
              onClick={handleConfirmDelete}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "white",
                color: "black",
                ":hover": {
                  background: "#4ba569",
                  color: "white",
                },
              }}
              onClick={handleCancelDelete}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Corousel;
