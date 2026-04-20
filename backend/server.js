const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/db");
const userRouter = require("./routers/userRouter");
const productRouter=require('./routers/productRouter')
const cors = require("cors");
const cartRoutes = require('./routers/cartRouter');
const wishlistRoutes = require('./routers/wishlistRouter');
const paymentRoutes = require('./routers/paymentRouter');
const adminRoutes = require('./routers/adminRouter');

db();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5174", // local
    "https://e-commerce-hazel-phi.vercel.app/" // deployed frontend
  ],
  credentials: true,
}));
app.use("/auth", userRouter);
app.use('/product',productRouter);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server have running on port ${PORT}`);
});
