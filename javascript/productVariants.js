const urlParams = new URLSearchParams(window.location.search);
const id_product = urlParams.get("id_product");

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id_product = urlParams.get("id_product");

    if (id_product) {
        fetchProductVariantsByProductId(id_product);
    } else {
        console.error("Không tìm thấy productId trong URL");
    }
    fetchColors();
    fetchSizes();
    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById("fileNameInput").value = file.name;  // Lưu vào input ẩn
        }
    });
});

async function fetchProductVariantsByProductId(id_product) {
    try {
        console.log(id_product)
        let response = await fetch(`http://localhost:3000/api/product_variants/${id_product}`);

        let productVariants = await response.json();
        console.log(productVariants);
        displayProductVariants(productVariants);
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
    }
}

async function fetchColors() {
    try {
        let response = await fetch("http://localhost:3000/api/colors"); 
        let colors = await response.json(); 

        let select = document.getElementById("ip_color");
        select.innerHTML = ""; 

        colors.forEach(color => {
            let option = document.createElement("option");
            option.value = color.id_color; 
            option.textContent = color.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách màu:", error);
    }
}

async function fetchSizes() {
    try {
        let response = await fetch("http://localhost:3000/api/sizes");
        let sizes = await response.json();

        let select = document.getElementById("ip_size");
        select.innerHTML = ""; 

        sizes.forEach(size => {
            let option = document.createElement("option");
            option.value = size.id_size; 
            option.textContent = size.name; 
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách size:", error);
    }
}

async function insertProductVariant() {
    if(validateInputs()!=true){
        return;
    }

    const quantity = document.getElementById("ip_quantity").value.trim();
    const cost_price = document.getElementById("ip_cost_price").value.trim();
    const selling_price = document.getElementById("ip_selling_price").value.trim();
    const id_size = document.getElementById("ip_size").value;
    const id_color = document.getElementById("ip_color").value;
    const fileName ="/"+ document.getElementById("fileNameInput").value; // Lấy tên file ảnh

    // Tạo object gửi lên API
    const productData = {
        quantity: Number(quantity),
        cost_price: Number(cost_price),
        selling_price: Number(selling_price),
        id_size: Number(id_size),
        id_color: Number(id_color),
        id_product: Number(id_product),
        image: fileName // Tên file ảnh
    };

    try {
        const response = await fetch("http://localhost:3000/api/product_variants/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Thêm sản phẩm thành công!");
            location.reload(); // Refresh lại trang sau khi thêm
        } else {
            alert("Lỗi: " + result.error);
        }
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
        alert("Lỗi kết nối server!");
    }
}

function chooseImage(event){
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("previewImage").src = e.target.result; // Hiển thị ảnh đã chọn
        };
        reader.readAsDataURL(file);
    }
}

function displayProductVariants(productVariants) {
    let productVariantList = document.getElementById("productVariantList");
    productVariants.forEach(productVariant=> {
        let productVariantItem = document.createElement("tr");
        document.getElementById("ip_name").value = productVariant.name;
        productVariantItem.innerHTML = `
            <td>${productVariant.id_variant}</td>
            <td>${productVariant.quantity}</td>
            <td>${productVariant.cost_price}</td>
            <td>${productVariant.selling_price}</td>
            <td>${productVariant.color}</td>
            <td>${productVariant.size}</td>
            <td style="width: 70px; padding:0px"><img src="http://localhost:3000/images/${productVariant.image}" style="width: 100%; margin: 0; display: block;"/><img></td>`;
        productVariantList.appendChild(productVariantItem);
    });
}

function changeStatusInput(status){
    if(status ==1){
        document.getElementById("ip_quantity").readOnly = false;
        document.getElementById("ip_cost_price").readOnly = false;
        document.getElementById("ip_selling_price").readOnly = false;
        document.getElementById("ip_size").disabled = false;
        document.getElementById("ip_color").disabled = false;
        document.getElementById("btn_save").disabled = false;
    }else{
        document.getElementById("ip_name").readOnly = true;
        document.getElementById("ip_quantity").readOnly = true;
        document.getElementById("ip_cost_price").readOnly = true;
        document.getElementById("ip_selling_price").readOnly = true;
        document.getElementById("ip_size").disabled = true;
        document.getElementById("ip_color").disabled = true;
        document.getElementById("btn_save").disabled = true;
    }}

    function validateInputs() {
        const quantityInput = document.getElementById("ip_quantity");
        const costPriceInput = document.getElementById("ip_cost_price");
        const sellingPriceInput = document.getElementById("ip_selling_price");
        const imageInput = document.getElementById("imageInput");
    
    
        // Kiểm tra số lượng (phải là số nguyên dương)
        if (quantityInput.value.trim() === "" || isNaN(quantityInput.value) || Number(quantityInput.value) <= 0) {
            alert("Vui lòng nhập số lượng hợp lệ!");
            quantityInput.focus();
            return false;
        }
    
        // Kiểm tra giá vốn (phải là số >= 0)
        if (costPriceInput.value.trim() === "" || isNaN(costPriceInput.value) || Number(costPriceInput.value) < 0) {
            alert("Vui lòng nhập giá vốn hợp lệ!");
            costPriceInput.focus();
            return false;
        }
    
        if (sellingPriceInput.value.trim() === "" || isNaN(sellingPriceInput.value) || Number(sellingPriceInput.value) < 0) {
            alert("Vui lòng nhập giá vốn hợp lệ!");
            sellingPriceInput.focus();
            return false;
        }

        // Kiểm tra hình ảnh (bắt buộc chọn file)
        if (imageInput.files.length === 0) {
            alert("Vui lòng chọn hình ảnh!");
            imageInput.focus();
            return false;
        }
    
        return true; // Nếu hợp lệ
    }

    function exit(){
        window.location.href = `../Products.html`;
    }