const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
    db.query(`SELECT * FROM colors;`, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;