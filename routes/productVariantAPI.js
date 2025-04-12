const express = require("express");
const db = require("../database"); 
const router = express.Router();

router.get("/:id_product", (req, res) => {
    const { id_product } = req.params;
    const query = `
        SELECT A.id_variant, B.name, A.quantity, A.cost_price, A.selling_price, A.image, C.name AS color, D.name AS size
        FROM product_variants A  LEFT JOIN 
        products B ON A.id_product = B.id_product LEFT JOIN 
        colors C ON A.id_color = C.id_color LEFT JOIN
        sizes D ON A.id_size = D.id_size
        WHERE B.id_product = ?;
    `;

    db.query(query, [id_product], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

router.post("/insert", async (req, res) => {
    const { quantity, cost_price, selling_price, image, id_product, id_size, id_color} = req.body;
    const query =` INSERT INTO product_variants(quantity, cost_price, selling_price, image, id_product, id_size, id_color)
    VALUES(?,?,?,?,?,?,?)`;
    db.query(query, [quantity, cost_price, selling_price, image,id_product, id_size, id_color], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

router.post("/update", async (req, res) => {
    const { id_variant,quantity, cost_price, selling_price} = req.body;
    const query =` UPDATE product_variants SET quantity=?, cost_price=?, selling_price=? Where id_variant=?`;
    db.query(query, [quantity, cost_price, selling_price, id_variant], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

module.exports = router;