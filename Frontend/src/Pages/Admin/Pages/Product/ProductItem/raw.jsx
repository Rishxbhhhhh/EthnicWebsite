const ProductItem = ({ product, onDelete, isAdmin, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
    const componentRef = useRef(null);
  
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
  
    const handleDeleteImage = async () => {
      const imageToDelete = product.images[currentImageIndex];
      const confirmDelete = window.confirm(
        `Are you sure you want to delete this image?`
      );
      if (!confirmDelete) return;
  
      try {
        // Call the API to delete the image
        await axios.delete(`http://localhost:8080/images/delete/${imageToDelete.publicId}`);
  
        // Update the local product images array after deletion
        const updatedImages = product.images.filter(
          (_, index) => index !== currentImageIndex
        );
        onUpdate(product._id, { images: updatedImages });
        alert("Image deleted successfully!");
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete the image. Please try again.");
      }
    };
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      beforeChange: (_, next) => setCurrentImageIndex(next), // Update the current image index
    };
  
    const handleEditClick = () => setIsEditing(true);
  
    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      setEditableFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    };
  
    const handleSaveClick = () => {
      onUpdate(product._id, editableFields);
      setIsEditing(false);
    };
  
    const handleCancelClick = () => {
      setIsEditing(false);
      setEditableFields({
        name: product.name,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
      });
    };
  
    return (
      <Card ref={componentRef} sx={{ maxWidth: 345, margin: 2 }}>
        <div style={{ position: "relative" }}>
          <Slider {...settings}>
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
          {isAdmin && (
            <Button
              onClick={handleDeleteImage}
              variant="contained"
              color="error"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 1,
              }}
            >
              Delete Image
            </Button>
          )}
        </div>
        <CardContent>
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
            <>
              <Typography
                className="productName"
                gutterBottom
                variant="h5"
                component="div"
              >
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.primary">
                Price: ₹{editableFields.price} |{" "}
                <span style={{ textDecoration: "line-through", color: "gray" }}>
                  ₹{editableFields.mrp}
                </span>
              </Typography>
            </>
          )}
          {isAdmin && (
            <div>
              {!isEditing && (
                <Button
                  onClick={handleEditClick}
                  color="primary"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
              )}
              <Button
                onClick={() => onDelete(product._id)}
                startIcon={<DeleteForeverIcon />}
                color="error"
                variant="contained"
                sx={{ mt: 2, float: "right" }}
              >
                Delete Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default ProductItem;
  