drop database qldh;

create database qldh;
use qldh;

create table colors(
	id_color INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name NVARCHAR(30),
    rgb CHAR (30)
);

create table sizes(
	id_size INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name NVARCHAR(30)
);

create table products(
	id_product INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name NVARCHAR(30),
    image char (20),
    des NVARCHAR(50)
);

create table product_variants(
	id_variant INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    id_product INT UNSIGNED,
    id_color INT UNSIGNED,
    id_size INT UNSIGNED,
	quantity INT DEFAULT 0,
    cost_price float,
    selling_price float,
    image char (20),
    FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE CASCADE,
    FOREIGN KEY (id_color) REFERENCES colors(id_color),
    FOREIGN KEY (id_size) REFERENCES sizes(id_size)
);

create table orders(
	id_order INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    customer NVARCHAR(30),
    phone CHAR (15),
    adress NVARCHAR(150),
    status INT,
    time DATE
);

create table order_detail(
	id_order INT UNSIGNED NOT NULL,
    id_variant INT UNSIGNED NOT NULL,
    quantity INT,
    total_price INT,
    PRIMARY KEY (id_variant, id_order),
    FOREIGN KEY (id_variant) REFERENCES product_variants(id_variant),
    FOREIGN KEY (id_order) REFERENCES orders(id_order)
);

INSERT INTO colors(name,rgb) VALUES (N'Màu đỏ','#FF0000');
INSERT INTO colors(name,rgb) VALUES (N'Màu đen ','#000000');
INSERT INTO colors(name,rgb) VALUES (N'Màu xanh dương','#000000');
INSERT INTO colors(name,rgb) VALUES (N'Màu trắng','#000000');
INSERT INTO colors(name,rgb) VALUES (N'Màu hồng','#000000');
INSERT INTO colors(name,rgb) VALUES (N'Màu xanh lá','#000000');
INSERT INTO colors(name,rgb) VALUES (N'Màu vàng','#000000');
INSERT INTO colors(name,rgb) VALUES (N'Màu cam','#000000');

INSERT INTO sizes(name) VALUES (N'S');
INSERT INTO sizes(name) VALUES (N'M');
INSERT INTO sizes(name) VALUES (N'L');
INSERT INTO sizes(name) VALUES (N'XL');
INSERT INTO sizes(name) VALUES (N'XXL');

DELIMITER $$

CREATE PROCEDURE addOrderDetail(
    IN p_id_order INT,
    IN p_id_variant INT,
    IN p_quantity INT
)
BEGIN
    -- Bước 1: Thêm bản ghi vào bảng order_detail
    INSERT INTO order_detail (id_order, id_variant, quantity)
    VALUES (p_id_order, p_id_variant, p_quantity);

    -- Bước 2: Cập nhật lại quantity trong bảng product_variant
    UPDATE product_variants
    SET quantity = quantity - p_quantity
    WHERE id_variant = p_id_variant;
    
    -- Kiểm tra lỗi nếu quantity trong product_variant nhỏ hơn số lượng cần trừ
    IF (SELECT quantity FROM product_variants WHERE id_variant = p_id_variant) < 0 THEN
        -- Nếu số lượng trong product_variant không đủ, trả về lỗi
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không đủ số lượng trong product_variant';
    END IF;
END$$

DELIMITER ;


