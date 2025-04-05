const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/:id_order", (req, res) => {
    const { id_order } = req.params;

    const query = `
        SELECT B.id_variant, C.name AS nameProduct, D.name AS nameColor, E.name AS nameSize, B.selling_price, A.quantity 
        FROM order_detail A
        LEFT JOIN product_variants B ON A.id_variant = B.id_variant
        LEFT JOIN products C ON B.id_product = C.id_product
        LEFT JOIN colors D ON D.id_color = B.id_color
        LEFT JOIN sizes E ON E.id_size = B.id_size
        WHERE id_order = ?;
    `;

    db.query(query, [id_order], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn database:", err);   
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng!" });
        }

        res.status(200).json(results);
    });
});
router.post("/insert_order_detail", (req, res) => {
    const {id_order, id_variant, quantity} = req.body;
    db.query("CALL addOrderDetail(?,?,?)", [id_order,id_variant, quantity], (err, results) => {
        if (err) {
            if (err.message.includes('Sản phẩm đã có trong đơn hàng')) {
                return res.status(400).json({ error: 'Sản phẩm đã có trong đơn hàng' });
            } else if (err.message.includes('Số lượng trong kho không đủ')) {
                return res.status(400).json({ error: 'Số lượng trong kho không đủ' });
            } else {
                // Lỗi khác
                return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            }
        }
        res.status(200).json(results);
    });
});

module.exports = router;