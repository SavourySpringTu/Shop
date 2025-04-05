const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",  
    user: "root",
    password: "111101",       
    database: "qldh",
    port: 3306,        
    connectTimeout: 5000 
});

db.connect((err) => {
    if (err) {
        console.error("❌ Lỗi kết nối MySQL:", err);
    } else {
        console.log("✅ Kết nối MySQL thành công!");
    }
});
module.exports = db;