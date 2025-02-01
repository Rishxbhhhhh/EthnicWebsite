import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material";

const ProductItem = ({ product, onDelete }) => {
  const isAdmin = useSelector((state) => state.admin.isAdmin); // Access admin state from Redux

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        image={product.images[0]?.url || "/placeholder.png"}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="body2" color="text.primary">
          Price: ₹{product.price} | Stock: {product.stock}
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="error"
            onClick={() => onDelete(product._id)}
            sx={{ marginTop: 2 }}
          >
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductItem;
