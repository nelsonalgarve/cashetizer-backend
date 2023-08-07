require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./models/connection');
const User = require('./models/user');
const Category = require('./models/category');
const fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const userRouter = require('./routers/user');
const checkIDRouter = require('./routers/checkID');
const uploadPhotoRouter = require('./routers/checkID');
const itemRouter = require('./routers/item');
const cartRouter = require('./routers/cart');
const categoryRouter = require('./routers/category');

// const orderRouter = require("./routers/order");

// const fs = require('fs');
// if (!fs.existsSync('/tmp')) {
// 	fs.mkdirSync('/tmp');
// }

const app = express();
app.use(fileUpload());
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(userRouter);

app.use('/item', itemRouter);
app.use('/Upload', uploadPhotoRouter);
app.use('/cart', cartRouter);
app.use('/checkId', checkIDRouter);
app.use('/category', categoryRouter);
app.use('./user', userRouter);

// app.use(orderRouter);
module.exports = app;
