document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById("fileNameInput").value = file.name;  // Lưu vào input ẩn
        }
    });
});

async function fetchProducts() {
    const id_product = ""
    const name = ""

    try {
        let response = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id_product,name})
        });

        let result = await response.json();
        clearTable();
        displayProducts(result);

    } catch (error) {
        console.error("Lỗi tìm đơn hàng:", error);
    }
}

function openProductVariantsPage(id_product) {
    window.location.href = `../ProductVariants.html?id_product=${id_product}`;
}

async function insertProduct(){
    if(validateInputs()==true){
        try {
            const name = document.getElementById("ip_name").value.trim();
            const des = document.getElementById("ip_des").value.trim();
            const image ="/"+ document.getElementById("fileNameInput").value;
            let response = await fetch("http://localhost:3000/api/products/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, des, image })
            });
            let result = await response.json();
            alert(result.message);
            clearInput();
            window.location.href = window.location.href;
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
        }
    }
}

async function findProducts() {
    const id_product = document.getElementById("ip_id").value.trim();
    const name = document.getElementById("ip_name").value.trim();


    try {
        let response = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_product, name })
        });

        let result = await response.json();
        clearInput();
        changeStatusInput(0);
        clearTable();
        displayProducts(result);

    } catch (error) {
        console.error("Lỗi tìm đơn hàng:", error);
    }
}

function displayProducts(products) {
    let productList = document.getElementById("productList");
    products.forEach(product => {
        let productItem = document.createElement("tr");
        productItem.innerHTML = `
            <td>${product.id_product}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.des}</td>
            <td style="width: 70px; padding:0px"><img src="http://localhost:3000/images/${product.image}" style="width: 100%; margin: 0; display: block;"/><img></td>
            <td onclick="openProductVariantsPage(${product.id_product})" style="cursor: pointer; color: blue; text-decoration: underline;">Chi tiết</td>
        `;
        productList.appendChild(productItem);
    });
}

function validateInputs() {
    const nameInput = document.getElementById("ip_name");
    const quantityInput = document.getElementById("ip_quantity");

    if (nameInput.value.trim() === "") {
        alert("Vui lòng nhập tên sản phẩm!");
        return false;
    }

    return true;
}

function changeStatusInput(status){
    if(status ==1){
        document.getElementById("ip_id").readOnly = false;
        document.getElementById("ip_name").readOnly = false;
        document.getElementById("ip_des").readOnly = false;
        document.getElementById("btn_save").disabled = false;
        document.getElementById("btn_find").disabled = false;
    }else{
        document.getElementById("ip_id").readOnly = true;
        document.getElementById("ip_name").readOnly = true;
        document.getElementById("ip_des").readOnly = true;
        document.getElementById("btn_save").disabled = true;
        document.getElementById("btn_find").disabled = true;
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

function clearInput() {
    document.getElementById("ip_id").value = "";
    document.getElementById("ip_name").value = "";
    document.getElementById("ip_des").value = "";
}
function clearTable() {
    const table = document.getElementById("productList");  // Thay "myTable" bằng id thực tế của bảng bạn.
    const rows = table.getElementsByTagName("tr");

    // Lặp qua các dòng và xóa chúng, bắt đầu từ cuối (để tránh thay đổi chỉ mục khi xóa)
    while (rows.length > 1) {  // Dòng đầu tiên có thể là tiêu đề nên bỏ qua
        table.deleteRow(1);  // Xóa dòng thứ 2 trở đi
    }
}

function exit(){
    window.location.href = `../Home.html`;
}

