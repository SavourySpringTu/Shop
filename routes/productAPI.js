const express = require("express");
const db = require("../database"); // Đường dẫn đúng tới db.js
const router = express.Router();

router.post("/", (req, res) => {
    const { id_product, name } = req.body;

    let query = `
        SELECT 
            A.id_product, 
            A.name, 
            A.des, 
            A.image,
            COUNT(B.id_variant) AS quantity
        FROM 
            products A 
        LEFT JOIN 
            product_variants B ON A.id_product = B.id_product 
        WHERE 1=1
    `;

    let queryParams = [];

    if (id_product) {
        query += " AND A.id_product = ?";
        queryParams.push(id_product);
    }
    if (name) {
        query += " AND A.name LIKE ?";
        queryParams.push(`%${name}%`);
    }

    query += " GROUP BY A.id_product LIMIT 15;";

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn database:", err);
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }

        res.status(200).json(results);
    });
});


router.post("/insert", (req, res) => {
    const { name, image, des} = req.body;
    const query = `INSERT INTO products (name, image, des) VALUES (?, ?, ?)`;
    db.query(query, [name, image, des], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Thêm sản phẩm thành công!", id_product: result.insertId });
    });
});

module.exports = router;
