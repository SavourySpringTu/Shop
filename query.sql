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
INSERT INTO sizes(name) VALUES (N'XS');
INSERT INTO sizes(name) VALUES (N'SML');
INSERT INTO sizes(name) VALUES (N'M');
INSERT INTO sizes(name) VALUES (N'L');
INSERT INTO sizes(name) VALUES (N'XL');
INSERT INTO sizes(name) VALUES (N'XXL');
INSERT INTO sizes(name) VALUES (N'XXXL');
INSERT INTO sizes(name) VALUES (N'0');
INSERT INTO sizes(name) VALUES (N'1');
INSERT INTO sizes(name) VALUES (N'2');
INSERT INTO sizes(name) VALUES (N'3');
INSERT INTO sizes(name) VALUES (N'4');
INSERT INTO sizes(name) VALUES (N'5');
INSERT INTO sizes(name) VALUES (N'6');
INSERT INTO sizes(name) VALUES (N'7');
INSERT INTO sizes(name) VALUES (N'8');
INSERT INTO sizes(name) VALUES (N'9');
INSERT INTO sizes(name) VALUES (N'10');

DELIMITER $$

CREATE PROCEDURE addOrderDetail(
    IN p_id_order INT,
    IN p_id_variant INT,
    IN p_quantity INT
)
BEGIN
    DECLARE current_quantity INT;
    DECLARE count_variant INT;

    -- 1. Kiểm tra sản phẩm đã tồn tại trong đơn hàng chưa
    SELECT COUNT(*) INTO count_variant
    FROM order_detail
    WHERE id_order = p_id_order AND id_variant = p_id_variant;

    IF count_variant > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sản phẩm đã có trong đơn hàng';
    END IF;

    -- 2. Lấy số lượng hiện có trong kho
    SELECT quantity INTO current_quantity
    FROM product_variants
    WHERE id_variant = p_id_variant;

    IF current_quantity IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sản phẩm không tồn tại';
    ELSEIF current_quantity < p_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng trong kho không đủ';
    ELSE
        -- 3. Thêm vào order_detail và cập nhật tồn kho
        INSERT INTO order_detail (id_order, id_variant, quantity)
        VALUES (p_id_order, p_id_variant, p_quantity);

        UPDATE product_variants
        SET quantity = quantity - p_quantity
        WHERE id_variant = p_id_variant;
    END IF;
END$$

DELIMITER ;

CALL addOrderDetail(6,1, 2); 

