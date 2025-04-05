const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(__dirname + "/images"));


// Import API từ các file
const productRouter = require("./routes/productAPI.js");
const productVariantsRouter = require("./routes/productVariantAPI.js");
const colorsRouter = require("./routes/colorsAPI.js");
const sizesRouter = require("./routes/sizesAPI.js");
const ordersRouter = require("./routes/ordersAPI.js");
const orderDetailRouter = require("./routes/orderDetailAPI.js");

// Sử dụng các API
app.use("/api/products", productRouter);
app.use("/api/product_variants", productVariantsRouter);
app.use("/api/colors", colorsRouter);
app.use("/api/sizes", sizesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/order_detail", orderDetailRouter);

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
