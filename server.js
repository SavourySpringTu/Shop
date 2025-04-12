const express = require("express");
const cors = require("cors");
const path = require("path"); // <- Quan trọng!

const app = express();
app.use(express.json());
app.use(cors());

// Phục vụ ảnh
app.use("/images", express.static(path.join(__dirname, "images")));

// Phục vụ HTML, CSS, JS tĩnh
app.use(express.static(path.join(__dirname, "views")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/javascript", express.static(path.join(__dirname, "javascript")));

// Import các route
const productRouter = require("./routes/productAPI.js");
const productVariantsRouter = require("./routes/productVariantAPI.js");
const colorsRouter = require("./routes/colorsAPI.js");
const sizesRouter = require("./routes/sizesAPI.js");
const ordersRouter = require("./routes/ordersAPI.js");
const orderDetailRouter = require("./routes/orderDetailAPI.js");

// Dùng router API
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
