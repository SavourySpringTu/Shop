const statusOrder = ["Chờ xác nhận", "Đang giao", "Hoàn thành"];

document.addEventListener("DOMContentLoaded", () => {
    fetchOrders();
});

async function fetchOrders() {
    try {
        let response = await fetch("http://localhost:3000/api/orders");
        let orders = await response.json();
        displayOrders(orders); 
    } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
    }
}

function openOrderDetailsPage(id_order) {
    window.location.href = `../OrderDetail.html?id_order=${id_order}`;
}

async function insertOrder(){
    if(validateInputs()==true){
        try {
            const customer = document.getElementById("ip_customer").value.trim();
            const phone = document.getElementById("ip_phone").value.trim();
            const adress = document.getElementById("ip_adress").value.trim();
            const time = formatDateFromInput(document.getElementById("ip_time").value.trim()); 
            const status = 0;

            const requestData = { customer, phone, adress, time, status };
            console.log("📤 Dữ liệu gửi lên API:", requestData);

            let response = await fetch("http://localhost:3000/api/orders/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ customer, phone, adress, time, status})
            });
            let result = await response.json();
            openOrderDetailsPage(result.id_order);
        } catch (error) {
            console.error("Lỗi thêm đơn hàng:", error);
        }
    }
}


function displayOrders(orders) {
    let orderList = document.getElementById("orderList");
    orders.forEach(order => {
        let orderItem = document.createElement("tr");
        orderItem.innerHTML = `
            <td>${order.id_order}</td>
            <td>${order.customer}</td>
            <td>${order.phone}</td>
            <td>${order.adress}</td>
            <td>${formatDatatoShow(order.time)}</td>
            <td>${statusOrder[order.status]}</td>
            <td onclick="openOrderDetailsPage(${order.id_order})" style="cursor: pointer; color: blue; text-decoration: underline;">Chi tiết</td>
        `;
        orderList.appendChild(orderItem);
    });
}

function validateInputs() {
    const customer = document.getElementById("ip_customer");
    const phone = document.getElementById("ip_phone");
    const adress = document.getElementById("ip_adress");
    const time = document.getElementById("ip_time");

    if (customer.value.trim() === "") {
        alert("Vui lòng nhập khách hàng!");
        return false;
    }

    if (phone.value.trim() === "") {
        alert("Vui lòng nhập số điện thoại!");
        return false;
    }

    if (adress.value.trim() === "") {
        alert("Vui lòng nhập dịa chỉ!");
        return false;
    }

    if (time.value.trim() === "") {
        alert("Vui lòng nhập thời gian!");
        return false;
    }

    return true;
}

async function findOrders() {
    const id_order = document.getElementById("ip_id").value.trim();
    const customer = document.getElementById("ip_customer").value.trim();
    const phone = document.getElementById("ip_phone").value.trim();
    const time = document.getElementById("ip_time").value.trim(); 

    try {
        let response = await fetch("http://localhost:3000/api/orders/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_order, customer, phone, time })
        });

        let result = await response.json();
        clearTable();
        displayOrders(result);

    } catch (error) {
        console.error("Lỗi tìm đơn hàng:", error);
    }
}

function clearTable() {
    const table = document.getElementById("orderList");  // Thay "myTable" bằng id thực tế của bảng bạn.
    const rows = table.getElementsByTagName("tr");

    // Lặp qua các dòng và xóa chúng, bắt đầu từ cuối (để tránh thay đổi chỉ mục khi xóa)
    while (rows.length > 1) {  // Dòng đầu tiên có thể là tiêu đề nên bỏ qua
        table.deleteRow(1);  // Xóa dòng thứ 2 trở đi
    }
}

function changeStatusInput(status){
    if(status ==1){
        document.getElementById("ip_id").readOnly = false;
        document.getElementById("ip_customer").readOnly = false;
        document.getElementById("ip_phone").readOnly = false;
        document.getElementById("ip_time").readOnly = false;
        document.getElementById("ip_status").readOnly = false;
        document.getElementById("ip_adress").readOnly = false;
        document.getElementById("btn_save").disabled = false;
        document.getElementById("btn_find").disabled = false;
    }else{
        document.getElementById("ip_id").readOnly = true;
        document.getElementById("ip_customer").readOnly = true;
        document.getElementById("ip_phone").readOnly = true;
        document.getElementById("ip_time").readOnly = true;
        document.getElementById("ip_status").readOnly = true;
        document.getElementById("ip_adress").readOnly = true;
        document.getElementById("btn_save").disabled = true;
        document.getElementById("btn_find").disabled = true;
    }
}

function formatDateFromInput(inputDate) {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;  // Trả về 'DD/MM/YYYY'
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

function exit(){
    window.location.href = `../Home.html`;
}