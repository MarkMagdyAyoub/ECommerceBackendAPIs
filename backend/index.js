const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRouter');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const cors = require('cors');
require('dotenv').config({ override: true});

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
    
app.use('/users', userRouter);
app.use('/category' , categoryRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);


app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT} ...`);
});
