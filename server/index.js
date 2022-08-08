require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
global.CacheClient = require("redis").createClient();

//apis
const userRoutes = require("./src/Routes/UserRoutes");
const categoryRoutes = require("./src/Routes/CategoryRoutes");
const subCategoryRoutes = require("./src/Routes/SubCategoryRoutes");
const productRoutes = require("./src/Routes/ProductRoutes");
const imageRoutes = require("./src/Routes/ImageRoutes");
const orderRoutes = require("./src/Routes/OrderRoutes");
const ciRoutes = require("./src/Routes/CartItemRoutes");
const coupoonRoutes = require("./src/Routes/CoupoonRoutes");
const bannerRoutes = require("./src/Routes/BannerRoutes");
const otpRoutes = require("./src/Routes/OtpRoutes");
const emailRoutes = require("./src/Routes/EmailRoutes");
const adminRoutes = require("./src/Routes/AdminRoutes");
const { notifyDevices } = require("./src/Services/FCMSercive");

//Middle Wares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
CacheClient.on("error", (e) => {
  console.error(e);
});
//ecomm apis
app.use(userRoutes);
app.use(categoryRoutes);
app.use(subCategoryRoutes);
app.use(productRoutes);
app.use(imageRoutes);
app.use(orderRoutes);
app.use(ciRoutes);
app.use(coupoonRoutes);
app.use(bannerRoutes);
app.use(otpRoutes);
app.use(emailRoutes);
app.use(adminRoutes);
app.use("/clearCache", (req, res) => {
  CacheClient.flushdb();
  console.log("cacheCleaned");
  res.json();
});

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("*** DB CONNECTION SUCCESSFULL ***");
    //Starting a server
    app.listen(process.env.PORT, async () => {
      CacheClient.flushdb();
      console.log(`*** SERVER STARTED AT PORT ${process.env.PORT} ***`);
    });
  })
  .catch((e) => {
    console.log("Startup Exception: " + e);
  });
