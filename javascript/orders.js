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
            const time = document.getElementById("ip_time").value.trim(); 
            const status = 0;

            let response = await fetch("http://localhost:3000/api/orders/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ customer, phone, adress, time, status})
            });
            let result = await response.json();
            //openOrderDetailsPage(result.id_order);
        } catch (error) {
            console.error("Lỗi thêm đơn hàng:", error);
        }
    }
}

async function updateOrder() {
    const id_order = document.getElementById("ip_id");
    if (id_order.value.trim() === "" || isNaN(id_order.value) || Number(id_order.value) < 0) {
        alert("Vui lòng chọn mã đơn hàng");
        idvariantInput.focus();
        return ;
    }

    if(validateInputs()==true){
        const customer = document.getElementById("ip_customer").value.trim();
        const phone = document.getElementById("ip_phone").value.trim();
        const adress = document.getElementById("ip_adress").value.trim();
        const time = document.getElementById("ip_time").value.trim(); 
        const status = document.getElementById("ip_status").value.trim();
        console.log(status)

        try {
            const response = await fetch("http://localhost:3000/api/orders/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_order: id_order.value.trim(),
                    customer,
                    phone,
                    adress,
                    time,
                    status
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Sửa đơn hàng thành công!");
                location.reload();
            } else {
                alert("Lỗi: " + result.error);
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
            alert("Lỗi kết nối server!");
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
        orderItem.addEventListener("click", (event) => {
            let clickedRow = event.currentTarget; 
            populateOrderInputs(order);
        });
        orderList.appendChild(orderItem);
    });
}

function populateOrderInputs(order) {
    document.getElementById("ip_id").value = order.id_order;
    document.getElementById("ip_adress").value = order.adress;
    document.getElementById("ip_phone").value = order.phone;
    document.getElementById("ip_customer").value = order.customer;
    document.getElementById("ip_time").value = formatToDateForInput(order.time);
    document.getElementById("ip_status").value = order.status;
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
    const table = document.getElementById("orderList"); 
    const rows = table.getElementsByTagName("tr");
    while (rows.length > 1) { 
        table.deleteRow(1);  
    }
}

function clearInput(){
    document.getElementById("ip_id").value = "";
    document.getElementById("ip_adress").value = "";
    document.getElementById("ip_phone").value = "";
    document.getElementById("ip_customer").value = "";
    document.getElementById("ip_time").value = "";
}


function exit(){
    window.location.href = `../Home.html`;
}
function formatDatatoShow(inputDate) {
    if (!inputDate || inputDate === 'undefined') {
        console.error("Ngày không hợp lệ:", inputDate);
        return '';
    }
    const dateObj = new Date(inputDate);

    const day = String(dateObj.getDate()).padStart(2, '0'); 
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;  
}

function formatToDateForInput(dateString) {
    const dateObj = new Date(dateString);  // Chuyển đổi chuỗi ngày thành đối tượng Date
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Tháng bắt đầu từ 0, cần cộng thêm 1
    const day = String(dateObj.getDate()).padStart(2, '0');  // Đảm bảo ngày có 2 chữ số

    return `${year}-${month}-${day}`;  // Trả về định dạng YYYY-MM-DD
}