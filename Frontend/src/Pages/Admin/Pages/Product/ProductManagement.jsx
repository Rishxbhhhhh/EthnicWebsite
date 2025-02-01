import React, { useEffect, useState } from "react";
import AddProductForm from "./AddProductForm/AddProductForm";
import ProductItem from "./ProductItem/ProductItem";
import { Grid, Button } from "@mui/material";
import SearchBox from "../../../../Component/Header/SearchBox/SearchBox"
import "./ProductManagement.css";
import NoProduct from "../../../../assets/images/noImage.png"

const ProductManagement = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, productsRes] = await Promise.all([
          fetch("http://localhost:8080/collections"),
          fetch("http://localhost:8080/products"),
        ]);
        const collectionsData = await collectionsRes.json();
        const productsData = await productsRes.json();


        if (productsData.length === 0) {
          setProducts([])
        }
        setCollections(collectionsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleProductDeleted = (deletedProductId) => {
    setProducts((prev) => prev.filter((product) => product._id !== deletedProductId));
  };

  const handleUpdateProduct = (updatedProductId, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProductId ? { ...product, ...updatedProduct } : product
      )
    );
  };
  
  return (
    <div>
      <h2 >Product Management</h2>
      <div>
        <SearchBox />
        <Button className="addProductButton" onClick={() => setShowForm(!showForm)} sx={{ float: 'right' }}>Add+</Button>
        {
          showForm && <AddProductForm collections={collections} onProductAdded={handleProductAdded} />
        }
      </div>
      <h2 className="m-3">All Products</h2>
      <Grid container spacing={2}>
        {products.length === 0 ? (
          <img src={NoProduct} alt="No Products Found" style={{ width: '104rem', height: '45rem' }} />
        ) : (
          products.map((product,index) => (
            <Grid item xs={12} sm={6} md={4} key={[product._id]}>
              <ProductItem key={product._id} product={product} onDelete={handleProductDeleted} isAdmin={true} onUpdate={(handleUpdateProduct)} />
            </Grid>
          )))}
      </Grid>
    </div>
  );
};

export default ProductManagement;
