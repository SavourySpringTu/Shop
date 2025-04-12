const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
    db.query(`SELECT * FROM orders;`, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

router.post("/insert", (req, res) => {
    let { customer, phone, adress, status, time } = req.body;
    console.log(req.body)
    try {
        const dateObj = new Date(time);
        const formattedDate = dateObj.toISOString().split("T")[0];

        const query = `
            INSERT INTO orders (customer, phone, adress, status, time) 
            VALUES (?, ?, ?, ?, ?)`;

        db.query(query, [customer, phone, adress, status, formattedDate], (err, result) => {
            if (err) {
                console.error("Lỗi khi chèn vào database:", err); 
                return res.status(500).json({ error: err.message });
            }

            console.log("Kết quả query:", result); 

            res.status(201).json({ message: "Thêm đơn hàng thành công!", id_order: result.insertId });
        });
    } catch (error) {
        console.error("Lỗi xử lý dữ liệu:", error);
        return res.status(500).json({ error: "Lỗi xử lý dữ liệu" });
    }
});


router.post("/find", (req, res) => {
    const { id_order, customer, phone, time } = req.body;

    let query = "SELECT * FROM orders WHERE 1=1";
    let queryParams = [];

    if (id_order) {
        query += " AND id_order = ?";
        queryParams.push(id_order);
    }
    if (customer) {
        query += " AND customer LIKE ?";
        queryParams.push(`%${customer}%`);
    }
    if (phone) {
        query += " AND phone LIKE ?";
        queryParams.push(`%${phone}%`);
    }
    if (time) {
        query += " AND time = ?";
        queryParams.push(time);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn database:", err);
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        }

        res.status(200).json(results);
    });
});

router.post("/update", async (req, res) => {
    const { id_order,customer, phone, adress, time,status} = req.body;
    console.log(customer)
    const query =` UPDATE orders SET customer=?, phone=?, adress=?, time=?, status=? Where id_order=?`;
    db.query(query, [customer, phone, adress, time,status, id_order], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

module.exports = router;