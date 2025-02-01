const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require("fs");
const fileUpload = require('express-fileupload');
require('./Models/db');
require('dotenv').config();

const PORT = process.env.PORT;

app.use(cors());
app.options("*", cors())
app.use(fileUpload({
  useTempFiles: true,        // Enables temp file creation
  tempFileDir: "/tmp/",      // Specifies the temp directory
}));

//middlewares
app.use(bodyParser.json());

//routes
const AuthRouter = require('./Routes/AuthRouter');
const CategoryRoutes = require('./Routes/Category');
const CollectionRoutes = require('./Routes/Collections');
const ProductRouter = require('./Routes/ProductRouter');
const UserRouter = require('./Routes/UserRouter');
app.use('/auth', AuthRouter);
app.use('/category', CategoryRoutes);
app.use('/collections', CollectionRoutes);
app.use('/products', ProductRouter);
app.use('/users',UserRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
})