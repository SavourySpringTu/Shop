const statusOrder = ["Chờ xác nhận", "Đang giao", "Hoàn thành"];

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id_order = urlParams.get("id_order");
    getOrderDetail(id_order); 
    getOrder(id_order);
});

async function getOrderDetail(id_order) {
    try {
        console.log(id_order)
        let response = await fetch(`http://localhost:3000/api/order_detail/${id_order}`);

        let orderDetail = await response.json();
        displayOrderDetail(orderDetail);
    } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
    }
}

async function getOrder(id_order) {
    try {
        let response = await fetch("http://localhost:3000/api/orders/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_order })
        });

        let result = await response.json();
        setInputOrderDetail(result[0]);

    } catch (error) {
        console.error("Lỗi tìm đơn hàng:", error);
    }
}

async function insertOrderDetail(){
    const id_variant = document.getElementById("ip_id_variant").value;
    const quantity = document.getElementById("ip_quantity").value;
    const urlParams = new URLSearchParams(window.location.search);
    const id_order = urlParams.get("id_order");

    if (id_variant === "" || isNaN(id_variant) || Number(id_variant) <= 0) {
        alert("Vui lòng nhập mã sản phẩm hợp lệ!");
        id_variant_input.focus();
        return;
    }

    // Kiểm tra quantity
    if (quantity === "" || isNaN(quantity) || Number(quantity) <= 0) {
        alert("Vui lòng nhập số lượng hợp lệ!");
        quantity_input.focus();
        return;
    }

    try {
        let response = await fetch("http://localhost:3000/api/order_detail/insert_order_detail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_order,id_variant, quantity })
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.error}`); 
            throw new Error(errorData.error || "Lỗi xảy ra từ phía server");
        }else{
            let result = await response.json();
            clearTable();
            getOrderDetail(id_order);
        }

    } catch (error) {
        console.error("Lỗi tìm đơn hàng:", error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN"); // Định dạng dd/MM/yyyy
}

function changeStatusInput(status){
    if(status==1){
        document.getElementById("ip_id_variant").readOnly = false;
        document.getElementById("btn_save").disabled = false;
        document.getElementById("ip_quantity").readOnly = false;
    }else{
        document.getElementById("ip_id_variant").readOnly = true
        document.getElementById("btn_save").disabled = true;
        document.getElementById("ip_quantity").readOnly = true;
    }
}

function setInputOrderDetail(order) {
    document.getElementById("ip_id").value = order.id_order;
    document.getElementById("ip_customer").value = order.customer;
    document.getElementById("ip_phone").value = order.phone;
    document.getElementById("ip_adress").value = order.adress;
    document.getElementById("ip_time").value = formatDatatoShow(order.time);
    document.getElementById("ip_status").value = order.status;
}

function displayOrderDetail(orderDetail) {
    let orderDetailList = document.getElementById("orderDetailList");
    let totalAmount = 0;

    orderDetail.forEach(order => {
        let orderDetailItem = document.createElement("tr");
        let totalPrice = parseInt(order.quantity, 10) * parseInt(order.selling_price, 10);
        totalAmount += totalPrice;

        orderDetailItem.innerHTML = `
            <td>${order.id_variant}</td>
            <td>${order.nameProduct}</td>
            <td>${order.nameColor}</td>
            <td>${order.nameSize}</td>
            <td>${order.quantity}</td>
            <td>${order.selling_price}</td>
            <td style="width: 70px; padding:0px"><img src="http://localhost:3000/images/${order.image}" style="width: 100%; margin: 0; display: block;"/><img></td>
            <td>${totalPrice}</td>
        `;
        orderDetailList.appendChild(orderDetailItem);
    });

    let totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="7" style="text-align: right; font-weight: bold;">Tổng cộng:</td>
        <td style="font-weight: bold;">${totalAmount}</td>
    `;
    orderDetailList.appendChild(totalRow);
}
function clearTable() {
    const table = document.getElementById("orderDetailList");  // Thay "myTable" bằng id thực tế của bảng bạn.
    const rows = table.getElementsByTagName("tr");

    // Lặp qua các dòng và xóa chúng, bắt đầu từ cuối (để tránh thay đổi chỉ mục khi xóa)
    while (rows.length > 1) {  // Dòng đầu tiên có thể là tiêu đề nên bỏ qua
        table.deleteRow(1);  // Xóa dòng thứ 2 trở đi
    }
}

function exit(){
    window.location.href = `../Orders.html`;
}

function printOrderDetail() {
    
    const variantContainer = document.getElementById("variant-container");
    variantContainer.style.display = "none";
    const status = document.getElementById("status");
    status.style.display = "none";

    window.print();
    location.reload(); 
}

function formatDatatoShow(inputDate) {
    // Kiểm tra nếu inputDate là một chuỗi hợp lệ
    if (!inputDate || inputDate === 'undefined') {
        console.error("Ngày không hợp lệ:", inputDate);
        return '';
    }
    const dateObj = new Date(inputDate);

    const day = String(dateObj.getDate()).padStart(2, '0');  // Đảm bảo ngày có 2 chữ số
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;  // Trả về 'DD/MM/YYYY'
}