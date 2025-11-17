# Hệ Thống Quản Lý Bán Hàng (QLBH)

Ứng dụng web đơn giản với Frontend (HTML/CSS/JavaScript) và Backend (Node.js/Express) để quản lý hệ thống bán hàng.

## Cấu trúc dự án

```
CSDLPT/
├── backend/
│   ├── config/
│   │   └── database.js         # Cấu hình kết nối database
│   ├── routes/
│   │   ├── index.js            # Tổng hợp tất cả routes
│   │   ├── branch.routes.js    # Routes cho Chi Nhánh
│   │   ├── employee.routes.js  # Routes cho Nhân Viên
│   │   ├── customer.routes.js  # Routes cho Khách Hàng
│   │   └── product.routes.js   # Routes cho Sản Phẩm
│   ├── server.js               # Entry point của server
│   ├── package.json            # Dependencies
│   └── .env.example            # File cấu hình mẫu
├── frontend/
│   ├── index.html              # Giao diện chính
│   ├── style.css               # Styling
│   └── script.js               # Logic xử lý frontend
```

## Chức năng

Ứng dụng hỗ trợ các chức năng CRUD (Thêm, Sửa, Xóa, Xem) cho:

- ✅ Chi Nhánh (BRANCH)
- ✅ Nhân Viên (EMPLOYEE)
- ✅ Khách Hàng (CUSTOMER)
- ✅ Sản Phẩm (PRODUCT)

## Cài đặt và Chạy

### 1. Chuẩn bị Database

Chạy script SQL để tạo database QLBH và các bảng (đã được cung cấp).

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình Database

Mở file `backend/config/database.js` và cập nhật thông tin kết nối database:

```javascript
const config = {
  user: "sa", 
  password: "your_password", 
  server: "localhost", 
  database: "QLBH",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
```

### 4. Chạy Backend Server

```bash
cd backend
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 5. Chạy Frontend

Mở file `frontend/index.html` bằng trình duyệt web hoặc sử dụng Live Server trong VS Code.

## API Endpoints

### Chi Nhánh (Branches)

- `GET /api/branches` - Lấy tất cả chi nhánh
- `GET /api/branches/:id` - Lấy chi nhánh theo ID
- `POST /api/branches` - Thêm chi nhánh mới
- `PUT /api/branches/:id` - Cập nhật chi nhánh
- `DELETE /api/branches/:id` - Xóa chi nhánh

### Nhân Viên (Employees)

- `GET /api/employees` - Lấy tất cả nhân viên
- `GET /api/employees/:id` - Lấy nhân viên theo ID
- `POST /api/employees` - Thêm nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên

### Khách Hàng (Customers)

- `GET /api/customers` - Lấy tất cả khách hàng
- `GET /api/customers/:id` - Lấy khách hàng theo ID
- `POST /api/customers` - Thêm khách hàng mới
- `PUT /api/customers/:id` - Cập nhật khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng

### Sản Phẩm (Products)

- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

## Công nghệ sử dụng

### Backend

- Node.js
- Express.js
- mssql (SQL Server driver)
- cors

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## Kiến trúc Backend

Backend được tổ chức theo mô hình modular:

- **config/**: Chứa cấu hình database và các config khác
- **routes/**: Chứa các route handlers cho từng entity (Branch, Employee, Customer, Product)
- **server.js**: Entry point, khởi tạo Express app và middleware

### Ưu điểm của cấu trúc này:

- ✅ Code dễ bảo trì và mở rộng
- ✅ Tách biệt logic của từng module
- ✅ Dễ dàng thêm routes mới
- ✅ Tuân thủ nguyên tắc Single Responsibility

## Lưu ý

1. Đảm bảo SQL Server đang chạy và database QLBH đã được tạo
2. Cập nhật thông tin kết nối database trong `config/database.js`
3. Backend phải chạy trước khi sử dụng Frontend
4. Mặc định backend chạy ở port 3000, frontend gọi API tới `http://localhost:3000/api`

## Hướng dẫn sử dụng

1. Mở giao diện web
2. Chọn tab tương ứng (Chi Nhánh, Nhân Viên, Khách Hàng, Sản Phẩm)
3. Nhấn nút "Thêm" để thêm mới
4. Nhấn "Sửa" để chỉnh sửa thông tin
5. Nhấn "Xóa" để xóa (sẽ có xác nhận)

## Mở rộng

Bạn có thể mở rộng ứng dụng bằng cách:

- Thêm các bảng còn lại (INVENTORY, INVOICE, INVOICE_DETAIL)
- Thêm chức năng tìm kiếm, lọc
- Thêm phân trang cho danh sách
- Thêm validation chi tiết hơn
- Thêm authentication/authorization
