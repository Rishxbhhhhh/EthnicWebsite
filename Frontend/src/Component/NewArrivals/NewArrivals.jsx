import React, { useEffect, useState } from "react";
import ProductItem from "../../Pages/Admin/Pages/Product/ProductItem/ProductItem"; // Reuse the ProductItem component
import { Grid, Typography, Button } from "@mui/material";
import "./NewArrivals.css";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch("http://localhost:8080/products/new-arrivals?days=30");
        const data = await response.json();
        setNewArrivals(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setLoading(false);
      } 
    };
    fetchNewArrivals();
  }, []);

  if (loading) {
    return <Typography>Loading New Arrivals...</Typography>;
  }

  if (newArrivals.length === 0) {
    return <Typography>No new arrivals found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom className='text-center m-4'> 
      <h1 style={{ fontFamily: 'monospace' }}>NEW ARRIVALS</h1> 
      </Typography>
      {
        newArrivals !== null ? (
          <Grid container spacing={2}>
            {
              newArrivals.map((product) => (
                <Grid className="new-product-conatiner" item xs={12} sm={6} md={4} key={product._id}>
                  <ProductItem product={product} isAdmin={false} />
                </Grid>
              ))}
          </Grid>
        ) : 
        (
          <h1></h1>
        )
      }
      <div className="buttonContainer">
        <Button className="viewAllButton">View All</Button>
      </div>
    </div>
  );
};

export default NewArrivals;
