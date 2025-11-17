const API_URL = "http://localhost:3000/api";

let currentEditId = null;
let currentEntity = null;

// ==================== TAB NAVIGATION ====================
function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Show selected tab
  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");

  // Load data for the selected tab
  if (tabName === "branches") loadBranches();
  else if (tabName === "employees") loadEmployees();
  else if (tabName === "customers") loadCustomers();
  else if (tabName === "products") loadProducts();
  else if (tabName === "inventory") loadInventory();
  else if (tabName === "invoices") loadInvoices();
}

// ==================== BRANCH FUNCTIONS ====================
async function loadBranches() {
  try {
    const response = await fetch(`${API_URL}/branches`);
    const branches = await response.json();
    const tbody = document.getElementById("branchTableBody");
    tbody.innerHTML = "";

    branches.forEach((branch) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${branch.branch_id}</td>
                <td>${branch.branch_name}</td>
                <td>${branch.address || ""}</td>
                <td>${branch.phone_number || ""}</td>
                <td>${branch.email || ""}</td>
                <td class="${
                  branch.status ? "status-active" : "status-inactive"
                }">
                    ${branch.status ? "Hoạt động" : "Không hoạt động"}
                </td>
                <td>
                    <button class="btn-edit" onclick="editBranch('${
                      branch.branch_id
                    }')">Sửa</button>
                    <button class="btn-delete" onclick="deleteBranch('${
                      branch.branch_id
                    }')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading branches:", error);
    alert("Lỗi khi tải danh sách chi nhánh");
  }
}

function showBranchForm() {
  currentEditId = null;
  document.getElementById("branchFormTitle").textContent = "Thêm Chi Nhánh Mới";
  document.getElementById("branchFormElement").reset();
  document.getElementById("branch_id").disabled = false;
  document.getElementById("branchForm").style.display = "block";
}

function hideBranchForm() {
  document.getElementById("branchForm").style.display = "none";
  currentEditId = null;
}

async function editBranch(id) {
  try {
    const response = await fetch(`${API_URL}/branches/${id}`);
    const branch = await response.json();

    currentEditId = id;
    document.getElementById("branchFormTitle").textContent =
      "Chỉnh Sửa Chi Nhánh";
    document.getElementById("branch_id").value = branch.branch_id;
    document.getElementById("branch_id").disabled = true;
    document.getElementById("branch_name").value = branch.branch_name;
    document.getElementById("branch_address").value = branch.address || "";
    document.getElementById("branch_phone").value = branch.phone_number || "";
    document.getElementById("branch_email").value = branch.email || "";
    document.getElementById("branch_founded_date").value = branch.founded_date
      ? branch.founded_date.split("T")[0]
      : "";
    document.getElementById("branch_type").value = branch.branch_type || "";
    document.getElementById("branch_status").value = branch.status ? "1" : "0";
    document.getElementById("branchForm").style.display = "block";
  } catch (error) {
    console.error("Error loading branch:", error);
    alert("Lỗi khi tải thông tin chi nhánh");
  }
}

async function deleteBranch(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) return;

  try {
    await fetch(`${API_URL}/branches/${id}`, { method: "DELETE" });
    alert("Xóa chi nhánh thành công");
    loadBranches();
  } catch (error) {
    console.error("Error deleting branch:", error);
    alert("Lỗi khi xóa chi nhánh");
  }
}

document
  .getElementById("branchFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      branch_id: document.getElementById("branch_id").value.trim(),
      branch_name: document.getElementById("branch_name").value,
      address: document.getElementById("branch_address").value,
      phone_number: document.getElementById("branch_phone").value,
      email: document.getElementById("branch_email").value,
      founded_date:
        document.getElementById("branch_founded_date").value || null,
      branch_type: document.getElementById("branch_type").value,
      status: parseInt(document.getElementById("branch_status").value),
    };

    try {
      if (currentEditId) {
        await fetch(`${API_URL}/branches/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Cập nhật chi nhánh thành công");
      } else {
        await fetch(`${API_URL}/branches`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Thêm chi nhánh thành công");
      }
      hideBranchForm();
      loadBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      alert("Lỗi khi lưu chi nhánh");
    }
  });

// ==================== EMPLOYEE FUNCTIONS ====================
async function loadEmployees() {
  try {
    const response = await fetch(`${API_URL}/employees`);
    const employees = await response.json();
    const tbody = document.getElementById("employeeTableBody");
    tbody.innerHTML = "";

    employees.forEach((emp) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${emp.employee_id}</td>
                <td>${emp.full_name}</td>
                <td>${emp.branch_id}</td>
                <td>${emp.position || ""}</td>
                <td>${emp.phone_number || ""}</td>
                <td>${emp.email || ""}</td>
                <td>${emp.salary ? emp.salary.toLocaleString("vi-VN") : ""}</td>
                <td class="${emp.status ? "status-active" : "status-inactive"}">
                    ${emp.status ? "Đang làm" : "Đã nghỉ"}
                </td>
                <td>
                    <button class="btn-edit" onclick="editEmployee('${
                      emp.employee_id
                    }')">Sửa</button>
                    <button class="btn-delete" onclick="deleteEmployee('${
                      emp.employee_id
                    }')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading employees:", error);
    alert("Lỗi khi tải danh sách nhân viên");
  }
}

function showEmployeeForm() {
  currentEditId = null;
  document.getElementById("employeeFormTitle").textContent =
    "Thêm Nhân Viên Mới";
  document.getElementById("employeeFormElement").reset();
  document.getElementById("employee_id").disabled = false;
  document.getElementById("employeeForm").style.display = "block";
}

function hideEmployeeForm() {
  document.getElementById("employeeForm").style.display = "none";
  currentEditId = null;
}

async function editEmployee(id) {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`);
    const emp = await response.json();

    currentEditId = id;
    document.getElementById("employeeFormTitle").textContent =
      "Chỉnh Sửa Nhân Viên";
    document.getElementById("employee_id").value = emp.employee_id;
    document.getElementById("employee_id").disabled = true;
    document.getElementById("employee_branch_id").value = emp.branch_id;
    document.getElementById("employee_full_name").value = emp.full_name;
    document.getElementById("employee_birth_date").value = emp.birth_date
      ? emp.birth_date.split("T")[0]
      : "";
    document.getElementById("employee_gender").value = emp.gender || "";
    document.getElementById("employee_phone").value = emp.phone_number || "";
    document.getElementById("employee_email").value = emp.email || "";
    document.getElementById("employee_position").value = emp.position || "";
    document.getElementById("employee_hire_date").value = emp.hire_date
      ? emp.hire_date.split("T")[0]
      : "";
    document.getElementById("employee_salary").value = emp.salary || "";
    document.getElementById("employee_status").value = emp.status ? "1" : "0";
    document.getElementById("employeeForm").style.display = "block";
  } catch (error) {
    console.error("Error loading employee:", error);
    alert("Lỗi khi tải thông tin nhân viên");
  }
}

async function deleteEmployee(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;

  try {
    await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
    alert("Xóa nhân viên thành công");
    loadEmployees();
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Lỗi khi xóa nhân viên");
  }
}

document
  .getElementById("employeeFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      employee_id: document.getElementById("employee_id").value.trim(),
      branch_id: document.getElementById("employee_branch_id").value.trim(),
      full_name: document.getElementById("employee_full_name").value,
      birth_date: document.getElementById("employee_birth_date").value || null,
      gender: document.getElementById("employee_gender").value,
      phone_number: document.getElementById("employee_phone").value,
      email: document.getElementById("employee_email").value,
      position: document.getElementById("employee_position").value,
      hire_date: document.getElementById("employee_hire_date").value || null,
      salary: parseFloat(document.getElementById("employee_salary").value) || 0,
      status: parseInt(document.getElementById("employee_status").value),
    };

    try {
      if (currentEditId) {
        await fetch(`${API_URL}/employees/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Cập nhật nhân viên thành công");
      } else {
        await fetch(`${API_URL}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Thêm nhân viên thành công");
      }
      hideEmployeeForm();
      loadEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Lỗi khi lưu nhân viên");
    }
  });

// ==================== CUSTOMER FUNCTIONS ====================
async function loadCustomers() {
  try {
    const response = await fetch(`${API_URL}/customers`);
    const customers = await response.json();
    const tbody = document.getElementById("customerTableBody");
    tbody.innerHTML = "";

    customers.forEach((cust) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${cust.customer_id}</td>
                <td>${cust.full_name}</td>
                <td>${cust.phone_number || ""}</td>
                <td>${cust.email || ""}</td>
                <td>${cust.address || ""}</td>
                <td>${cust.customer_type || ""}</td>
                <td>${cust.reward_points}</td>
                <td>
                    <button class="btn-edit" onclick="editCustomer('${
                      cust.customer_id
                    }')">Sửa</button>
                    <button class="btn-delete" onclick="deleteCustomer('${
                      cust.customer_id
                    }')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading customers:", error);
    alert("Lỗi khi tải danh sách khách hàng");
  }
}

function showCustomerForm() {
  currentEditId = null;
  document.getElementById("customerFormTitle").textContent =
    "Thêm Khách Hàng Mới";
  document.getElementById("customerFormElement").reset();
  document.getElementById("customer_id").disabled = false;
  document.getElementById("customerForm").style.display = "block";
}

function hideCustomerForm() {
  document.getElementById("customerForm").style.display = "none";
  currentEditId = null;
}

async function editCustomer(id) {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`);
    const cust = await response.json();

    currentEditId = id;
    document.getElementById("customerFormTitle").textContent =
      "Chỉnh Sửa Khách Hàng";
    document.getElementById("customer_id").value = cust.customer_id;
    document.getElementById("customer_id").disabled = true;
    document.getElementById("customer_branch_id").value = cust.branch_id;
    document.getElementById("customer_full_name").value = cust.full_name;
    document.getElementById("customer_phone").value = cust.phone_number || "";
    document.getElementById("customer_email").value = cust.email || "";
    document.getElementById("customer_address").value = cust.address || "";
    document.getElementById("customer_registration_date").value =
      cust.registration_date ? cust.registration_date.split("T")[0] : "";
    document.getElementById("customer_type").value = cust.customer_type || "";
    document.getElementById("customer_reward_points").value =
      cust.reward_points;
    document.getElementById("customerForm").style.display = "block";
  } catch (error) {
    console.error("Error loading customer:", error);
    alert("Lỗi khi tải thông tin khách hàng");
  }
}

async function deleteCustomer(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;

  try {
    await fetch(`${API_URL}/customers/${id}`, { method: "DELETE" });
    alert("Xóa khách hàng thành công");
    loadCustomers();
  } catch (error) {
    console.error("Error deleting customer:", error);
    alert("Lỗi khi xóa khách hàng");
  }
}

document
  .getElementById("customerFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      customer_id: document.getElementById("customer_id").value.trim(),
      branch_id: document.getElementById("customer_branch_id").value.trim(),
      full_name: document.getElementById("customer_full_name").value,
      phone_number: document.getElementById("customer_phone").value,
      email: document.getElementById("customer_email").value,
      address: document.getElementById("customer_address").value,
      registration_date:
        document.getElementById("customer_registration_date").value || null,
      customer_type: document.getElementById("customer_type").value,
      reward_points:
        parseInt(document.getElementById("customer_reward_points").value) || 0,
    };

    try {
      if (currentEditId) {
        await fetch(`${API_URL}/customers/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Cập nhật khách hàng thành công");
      } else {
        await fetch(`${API_URL}/customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Thêm khách hàng thành công");
      }
      hideCustomerForm();
      loadCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Lỗi khi lưu khách hàng");
    }
  });

// ==================== PRODUCT FUNCTIONS ====================
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    const tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";

    products.forEach((prod) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${prod.product_id}</td>
                <td>${prod.product_name}</td>
                <td>${prod.category || ""}</td>
                <td>${prod.unit || ""}</td>
                <td>${prod.price ? prod.price.toLocaleString("vi-VN") : ""}</td>
                <td class="${
                  prod.status ? "status-active" : "status-inactive"
                }">
                    ${prod.status ? "Còn hàng" : "Hết hàng"}
                </td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${
                      prod.product_id
                    }')">Sửa</button>
                    <button class="btn-delete" onclick="deleteProduct('${
                      prod.product_id
                    }')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Lỗi khi tải danh sách sản phẩm");
  }
}

function showProductForm() {
  currentEditId = null;
  document.getElementById("productFormTitle").textContent = "Thêm Sản Phẩm Mới";
  document.getElementById("productFormElement").reset();
  document.getElementById("product_id").disabled = false;
  document.getElementById("productForm").style.display = "block";
}

function hideProductForm() {
  document.getElementById("productForm").style.display = "none";
  currentEditId = null;
}

async function editProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const prod = await response.json();

    currentEditId = id;
    document.getElementById("productFormTitle").textContent =
      "Chỉnh Sửa Sản Phẩm";
    document.getElementById("product_id").value = prod.product_id;
    document.getElementById("product_id").disabled = true;
    document.getElementById("product_name").value = prod.product_name;
    document.getElementById("product_category").value = prod.category || "";
    document.getElementById("product_unit").value = prod.unit || "";
    document.getElementById("product_price").value = prod.price || "";
    document.getElementById("product_description").value =
      prod.description || "";
    document.getElementById("product_status").value = prod.status ? "1" : "0";
    document.getElementById("productForm").style.display = "block";
  } catch (error) {
    console.error("Error loading product:", error);
    alert("Lỗi khi tải thông tin sản phẩm");
  }
}

async function deleteProduct(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

  try {
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    alert("Xóa sản phẩm thành công");
    loadProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Lỗi khi xóa sản phẩm");
  }
}

document
  .getElementById("productFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      product_id: document.getElementById("product_id").value.trim(),
      product_name: document.getElementById("product_name").value,
      category: document.getElementById("product_category").value,
      unit: document.getElementById("product_unit").value,
      price: parseFloat(document.getElementById("product_price").value),
      description: document.getElementById("product_description").value,
      status: parseInt(document.getElementById("product_status").value),
    };

    try {
      if (currentEditId) {
        await fetch(`${API_URL}/products/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Cập nhật sản phẩm thành công");
      } else {
        await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Thêm sản phẩm thành công");
      }
      hideProductForm();
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Lỗi khi lưu sản phẩm");
    }
  });

// ==================== INVENTORY FUNCTIONS ====================
let branchList = [];
let productList = [];

async function loadInventory() {
  try {
    const response = await fetch(`${API_URL}/inventory`);
    const inventory = await response.json();
    console.log("=== INVENTORY DATA ===");
    console.log("Response:", inventory);
    console.log("Type:", typeof inventory);
    console.log("Is Array:", Array.isArray(inventory));
    if (inventory.length > 0) {
      console.log("First item:", inventory[0]);
    }
    console.log("=====================");

    const tbody = document.getElementById("inventoryTableBody");
    tbody.innerHTML = "";

    inventory.forEach((item) => {
      const tr = document.createElement("tr");
      const lastRestock = item.last_restock_date
        ? new Date(item.last_restock_date).toLocaleDateString("vi-VN")
        : "";
      tr.innerHTML = `
                <td>${item.branch_name || item.branch_id}</td>
                <td>${item.product_name || item.product_id}</td>
                <td>${item.stock_quantity || 0}</td>
                <td>${lastRestock}</td>
                <td>${item.notes || ""}</td>
                <td>
                    <button class="btn-edit" onclick="editInventory('${
                      item.inventory_id
                    }')">Sửa</button>
                    <button class="btn-delete" onclick="deleteInventory('${
                      item.inventory_id
                    }')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading inventory:", error);
    alert("Lỗi khi tải danh sách kho hàng");
  }
}

async function loadBranchesAndProducts() {
  try {
    const [branchResponse, productResponse] = await Promise.all([
      fetch(`${API_URL}/branches`),
      fetch(`${API_URL}/products`),
    ]);
    branchList = await branchResponse.json();
    productList = await productResponse.json();

    // Populate dropdowns for inventory
    const branchSelect = document.getElementById("inventory_branch_id");
    const productSelect = document.getElementById("inventory_product_id");

    branchSelect.innerHTML = '<option value="">Chọn chi nhánh</option>';
    productSelect.innerHTML = '<option value="">Chọn sản phẩm</option>';

    branchList.forEach((branch) => {
      branchSelect.innerHTML += `<option value="${branch.branch_id}">${branch.branch_name}</option>`;
    });

    productList.forEach((product) => {
      productSelect.innerHTML += `<option value="${product.product_id}">${product.product_name}</option>`;
    });

    // Populate dropdowns for invoices
    const invBranchSelect = document.getElementById("invoice_branch_id");
    const invCustomerSelect = document.getElementById("invoice_customer_id");
    const invEmployeeSelect = document.getElementById("invoice_employee_id");

    invBranchSelect.innerHTML = '<option value="">Chọn chi nhánh</option>';
    branchList.forEach((branch) => {
      invBranchSelect.innerHTML += `<option value="${branch.branch_id}">${branch.branch_name}</option>`;
    });

    const [customerResponse, employeeResponse] = await Promise.all([
      fetch(`${API_URL}/customers`),
      fetch(`${API_URL}/employees`),
    ]);
    const customers = await customerResponse.json();
    const employees = await employeeResponse.json();

    invCustomerSelect.innerHTML = '<option value="">Chọn khách hàng</option>';
    customers.forEach((customer) => {
      invCustomerSelect.innerHTML += `<option value="${customer.customer_id}">${customer.full_name}</option>`;
    });

    invEmployeeSelect.innerHTML = '<option value="">Chọn nhân viên</option>';
    employees.forEach((employee) => {
      invEmployeeSelect.innerHTML += `<option value="${employee.employee_id}">${employee.full_name}</option>`;
    });
  } catch (error) {
    console.error("Error loading branches and products:", error);
  }
}

function showInventoryForm() {
  currentEditId = null;
  loadBranchesAndProducts();
  document.getElementById("inventoryFormTitle").textContent =
    "Thêm Hàng Tồn Mới";
  document.getElementById("inventoryFormElement").reset();
  document.getElementById("inventoryForm").style.display = "block";
}

function hideInventoryForm() {
  document.getElementById("inventoryForm").style.display = "none";
  currentEditId = null;
}

async function editInventory(inventoryId) {
  try {
    const response = await fetch(`${API_URL}/inventory/${inventoryId}`);
    const item = await response.json();

    await loadBranchesAndProducts();

    currentEditId = inventoryId;
    document.getElementById("inventoryFormTitle").textContent =
      "Chỉnh Sửa Hàng Tồn";
    document.getElementById("inventory_id").value = item.inventory_id;
    document.getElementById("inventory_branch_id").value = item.branch_id;
    document.getElementById("inventory_product_id").value = item.product_id;
    document.getElementById("inventory_quantity").value =
      item.stock_quantity || 0;
    document.getElementById("inventory_restock_date").value =
      item.last_restock_date ? item.last_restock_date.split("T")[0] : "";
    document.getElementById("inventory_notes").value = item.notes || "";
    document.getElementById("inventoryForm").style.display = "block";
  } catch (error) {
    console.error("Error loading inventory:", error);
    alert("Lỗi khi tải thông tin hàng tồn");
  }
}

async function deleteInventory(inventoryId) {
  if (!confirm("Bạn có chắc chắn muốn xóa hàng tồn này?")) return;

  try {
    await fetch(`${API_URL}/inventory/${inventoryId}`, {
      method: "DELETE",
    });
    alert("Xóa hàng tồn thành công");
    loadInventory();
  } catch (error) {
    console.error("Error deleting inventory:", error);
    alert("Lỗi khi xóa hàng tồn");
  }
}

document
  .getElementById("inventoryFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      inventory_id: document.getElementById("inventory_id").value.trim(),
      branch_id: document.getElementById("inventory_branch_id").value,
      product_id: document.getElementById("inventory_product_id").value,
      stock_quantity:
        parseInt(document.getElementById("inventory_quantity").value) || 0,
      last_restock_date:
        document.getElementById("inventory_restock_date").value || null,
      notes: document.getElementById("inventory_notes").value || null,
    };

    try {
      if (currentEditId) {
        await fetch(`${API_URL}/inventory/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Cập nhật hàng tồn thành công");
      } else {
        await fetch(`${API_URL}/inventory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        alert("Thêm hàng tồn thành công");
      }
      hideInventoryForm();
      loadInventory();
    } catch (error) {
      console.error("Error saving inventory:", error);
      alert("Lỗi khi lưu hàng tồn");
    }
  });

// ==================== INVOICE FUNCTIONS ====================
async function loadInvoices() {
  try {
    const response = await fetch(`${API_URL}/invoices`);
    const invoices = await response.json();
    const tbody = document.getElementById("invoiceTableBody");
    tbody.innerHTML = "";

    invoices.forEach((invoice) => {
      const tr = document.createElement("tr");
      const invoiceDate = invoice.invoice_date
        ? new Date(invoice.invoice_date).toLocaleString("vi-VN")
        : "";
      tr.innerHTML = `
                <td>${invoice.invoice_id}</td>
                <td>${invoice.branch_name || invoice.branch_id}</td>
                <td>${
                  invoice.customer_name || invoice.customer_id || "N/A"
                }</td>
                <td>${invoice.employee_name || invoice.employee_id}</td>
                <td>${invoiceDate}</td>
                <td>${
                  invoice.final_amount
                    ? invoice.final_amount.toLocaleString("vi-VN")
                    : "0"
                }</td>
                <td class="status-${(
                  invoice.status || "pending"
                ).toLowerCase()}">${invoice.status || "Pending"}</td>
                <td>
                    <button class="btn-edit" onclick="editInvoice('${invoice.invoice_id.trim()}')">Sửa</button>
                    <button class="btn-edit" onclick="viewInvoice('${invoice.invoice_id.trim()}')">Xem</button>
                    <button class="btn-delete" onclick="deleteInvoice('${invoice.invoice_id.trim()}')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading invoices:", error);
    alert("Lỗi khi tải danh sách hóa đơn");
  }
}

function showInvoiceForm() {
  currentEditId = null;
  loadBranchesAndProducts();
  document.getElementById("invoiceFormTitle").textContent = "Tạo Hóa Đơn Mới";
  document.getElementById("invoiceFormElement").reset();
  document.getElementById("invoice_id").disabled = false;
  document.getElementById("invoice_id").disabled = false;

  // Set default date to now
  const now = new Date();
  const dateString = now.toISOString().slice(0, 16);
  document.getElementById("invoice_date").value = dateString;

  // Reset details
  const detailsContainer = document.getElementById("invoiceDetails");
  detailsContainer.innerHTML = `
        <div class="invoice-detail-row">
            <select class="detail-product" required>
                <option value="">Chọn sản phẩm</option>
            </select>
            <input type="number" class="detail-quantity" placeholder="Số lượng" min="1" required />
            <input type="number" class="detail-price" placeholder="Đơn giá" step="0.01" required />
            <button type="button" class="btn-remove" onclick="removeDetailRow(this)">Xóa</button>
        </div>
    `;
  updateProductSelects();
  document.getElementById("invoiceForm").style.display = "block";
}

function hideInvoiceForm() {
  document.getElementById("invoiceForm").style.display = "none";
  currentEditId = null;
}

function addDetailRow() {
  const detailsContainer = document.getElementById("invoiceDetails");
  const newRow = document.createElement("div");
  newRow.className = "invoice-detail-row";
  newRow.innerHTML = `
        <select class="detail-product" required>
            <option value="">Chọn sản phẩm</option>
        </select>
        <input type="number" class="detail-quantity" placeholder="Số lượng" min="1" required />
        <input type="number" class="detail-price" placeholder="Đơn giá" step="0.01" required />
        <button type="button" class="btn-remove" onclick="removeDetailRow(this)">Xóa</button>
    `;
  detailsContainer.appendChild(newRow);
  updateProductSelects();
  attachDetailEventListeners(newRow);
}

function removeDetailRow(button) {
  const detailsContainer = document.getElementById("invoiceDetails");
  if (detailsContainer.children.length > 1) {
    button.parentElement.remove();
    calculateTotal();
  } else {
    alert("Phải có ít nhất một sản phẩm trong hóa đơn");
  }
}

function updateProductSelects() {
  const productSelects = document.querySelectorAll(".detail-product");
  productSelects.forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">Chọn sản phẩm</option>';
    productList.forEach((product) => {
      select.innerHTML += `<option value="${product.product_id}" data-price="${
        product.price
      }">${product.product_name} - ${product.price.toLocaleString(
        "vi-VN"
      )} VNĐ</option>`;
    });
    if (currentValue) select.value = currentValue;
  });
}

function attachDetailEventListeners(row) {
  const productSelect = row.querySelector(".detail-product");
  const priceInput = row.querySelector(".detail-price");
  const quantityInput = row.querySelector(".detail-quantity");

  productSelect.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const price = selectedOption.getAttribute("data-price");
    if (price) {
      priceInput.value = price;
      calculateTotal();
    }
  });

  quantityInput.addEventListener("input", calculateTotal);
  priceInput.addEventListener("input", calculateTotal);
}

function calculateTotal() {
  let total = 0;
  const rows = document.querySelectorAll(".invoice-detail-row");

  rows.forEach((row) => {
    const quantity =
      parseFloat(row.querySelector(".detail-quantity").value) || 0;
    const price = parseFloat(row.querySelector(".detail-price").value) || 0;
    total += quantity * price;
  });

  const discount =
    parseFloat(document.getElementById("invoice_discount").value) || 0;
  const finalAmount = total - discount;

  document.getElementById("totalAmount").textContent =
    total.toLocaleString("vi-VN");
  document.getElementById("finalAmount").textContent =
    finalAmount.toLocaleString("vi-VN");
}

async function viewInvoice(id) {
  try {
    const response = await fetch(`${API_URL}/invoices/${id}`);
    const invoice = await response.json();

    console.log("=== VIEW INVOICE ===");
    console.log("Invoice ID:", id);
    console.log("Response:", invoice);
    console.log("Details:", invoice.details);
    console.log("Details length:", invoice.details?.length || 0);
    console.log("Details is array:", Array.isArray(invoice.details));
    console.log("==================");

    // Build modal content
    let modalContent = `
      <div class="invoice-info">
        <div class="invoice-info-item">
          <span class="invoice-info-label">Mã Hóa Đơn</span>
          <span class="invoice-info-value">${invoice.invoice_id.trim()}</span>
        </div>
        <div class="invoice-info-item">
          <span class="invoice-info-label">Ngày Lập</span>
          <span class="invoice-info-value">${new Date(
            invoice.invoice_date
          ).toLocaleString("vi-VN")}</span>
        </div>
        <div class="invoice-info-item">
          <span class="invoice-info-label">Chi Nhánh</span>
          <span class="invoice-info-value">${
            invoice.branch_name || invoice.branch_id.trim()
          }</span>
        </div>
        <div class="invoice-info-item">
          <span class="invoice-info-label">Khách Hàng</span>
          <span class="invoice-info-value">${
            invoice.customer_name || invoice.customer_id?.trim() || "N/A"
          }</span>
        </div>
        <div class="invoice-info-item">
          <span class="invoice-info-label">Nhân Viên</span>
          <span class="invoice-info-value">${
            invoice.employee_name || invoice.employee_id.trim()
          }</span>
        </div>
        <div class="invoice-info-item">
          <span class="invoice-info-label">Phương Thức Thanh Toán</span>
          <span class="invoice-info-value">${
            invoice.payment_method || "Chưa xác định"
          }</span>
        </div>
        <div class="invoice-info-item">
          <span class="invoice-info-label">Trạng Thái</span>
          <span class="invoice-info-value status-${(
            invoice.status || "pending"
          ).toLowerCase()}">${invoice.status || "Pending"}</span>
        </div>
      </div>

      <h3 style="margin-top: 30px; margin-bottom: 15px;">Chi Tiết Sản Phẩm</h3>
    `;

    if (invoice.details && invoice.details.length > 0) {
      modalContent += `
        <table class="invoice-details-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản Phẩm</th>
              <th>Đơn Vị</th>
              <th style="text-align: right;">Số Lượng</th>
              <th style="text-align: right;">Đơn Giá</th>
              <th style="text-align: right;">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
      `;

      invoice.details.forEach((detail, index) => {
        const lineTotal = detail.quantity * detail.unit_price;
        const productDisplay = detail.product_name
          ? `${detail.product_name} (${detail.product_id.trim()})`
          : detail.product_id.trim();

        modalContent += `
          <tr>
            <td>${index + 1}</td>
            <td>${productDisplay}</td>
            <td>${detail.unit || ""}</td>
            <td style="text-align: right;">${detail.quantity}</td>
            <td style="text-align: right;">${detail.unit_price.toLocaleString(
              "vi-VN"
            )} ₫</td>
            <td style="text-align: right;">${lineTotal.toLocaleString(
              "vi-VN"
            )} ₫</td>
          </tr>
        `;
      });

      modalContent += `
          </tbody>
        </table>
      `;
    } else {
      modalContent += `<p style="text-align: center; color: #999; padding: 20px;">Không có chi tiết sản phẩm</p>`;
    }

    modalContent += `
      <div class="invoice-summary-box">
        <div class="invoice-summary-row">
          <span class="invoice-summary-label">Tổng Tiền:</span>
          <span class="invoice-summary-value">${invoice.total_amount.toLocaleString(
            "vi-VN"
          )} ₫</span>
        </div>
        <div class="invoice-summary-row">
          <span class="invoice-summary-label">Giảm Giá:</span>
          <span class="invoice-summary-value">${(
            invoice.discount || 0
          ).toLocaleString("vi-VN")} ₫</span>
        </div>
        <div class="invoice-summary-row total">
          <span class="invoice-summary-label">Thành Tiền:</span>
          <span class="invoice-summary-value">${invoice.final_amount.toLocaleString(
            "vi-VN"
          )} ₫</span>
        </div>
      </div>
    `;

    document.getElementById("invoiceModalBody").innerHTML = modalContent;
    document.getElementById("invoiceModal").style.display = "block";
  } catch (error) {
    console.error("Error loading invoice:", error);
    alert("Lỗi khi tải thông tin hóa đơn");
  }
}

function closeInvoiceModal() {
  document.getElementById("invoiceModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("invoiceModal");
  if (event.target === modal) {
    closeInvoiceModal();
  }
};

async function deleteInvoice(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) return;

  try {
    await fetch(`${API_URL}/invoices/${id}`, { method: "DELETE" });
    alert("Xóa hóa đơn thành công");
    loadInvoices();
  } catch (error) {
    console.error("Error deleting invoice:", error);
    alert("Lỗi khi xóa hóa đơn");
  }
}

async function editInvoice(id) {
  try {
    const response = await fetch(`${API_URL}/invoices/${id}`);
    const invoice = await response.json();

    console.log("=== EDIT INVOICE ===");
    console.log("Invoice:", invoice);
    console.log("==================");

    await loadBranchesAndProducts();

    currentEditId = id;
    document.getElementById("invoiceFormTitle").textContent =
      "Chỉnh Sửa Hóa Đơn";
    document.getElementById("invoice_id").value = invoice.invoice_id.trim();
    document.getElementById("invoice_id").disabled = true;

    // Set selected values for dropdowns (trim to match CHAR field spaces)
    const branchSelect = document.getElementById("invoice_branch_id");
    const customerSelect = document.getElementById("invoice_customer_id");
    const employeeSelect = document.getElementById("invoice_employee_id");

    // Find and select the matching options
    Array.from(branchSelect.options).forEach((option) => {
      if (option.value.trim() === invoice.branch_id.trim()) {
        option.selected = true;
      }
    });

    Array.from(customerSelect.options).forEach((option) => {
      if (option.value.trim() === invoice.customer_id?.trim()) {
        option.selected = true;
      }
    });

    Array.from(employeeSelect.options).forEach((option) => {
      if (option.value.trim() === invoice.employee_id.trim()) {
        option.selected = true;
      }
    });

    const invoiceDate = new Date(invoice.invoice_date);
    const dateString = invoiceDate.toISOString().slice(0, 16);
    document.getElementById("invoice_date").value = dateString;

    document.getElementById("invoice_payment_method").value =
      invoice.payment_method || "";
    document.getElementById("invoice_status").value =
      invoice.status || "Pending";
    document.getElementById("invoice_discount").value = invoice.discount || 0;

    // Load details
    const detailsContainer = document.getElementById("invoiceDetails");
    detailsContainer.innerHTML = "";

    if (invoice.details && invoice.details.length > 0) {
      invoice.details.forEach((detail) => {
        const newRow = document.createElement("div");
        newRow.className = "invoice-detail-row";
        newRow.innerHTML = `
          <select class="detail-product" required>
            <option value="">Chọn sản phẩm</option>
          </select>
          <input type="number" class="detail-quantity" placeholder="Số lượng" min="1" value="${detail.quantity}" required />
          <input type="number" class="detail-price" placeholder="Đơn giá" step="0.01" value="${detail.unit_price}" required />
          <button type="button" class="btn-remove" onclick="removeDetailRow(this)">Xóa</button>
        `;
        detailsContainer.appendChild(newRow);

        const productSelect = newRow.querySelector(".detail-product");
        productList.forEach((product) => {
          const option = document.createElement("option");
          option.value = product.product_id;
          option.setAttribute("data-price", product.price);
          option.textContent = `${
            product.product_name
          } - ${product.price.toLocaleString("vi-VN")} VNĐ`;
          if (product.product_id.trim() === detail.product_id.trim()) {
            option.selected = true;
          }
          productSelect.appendChild(option);
        });

        attachDetailEventListeners(newRow);
      });
    } else {
      // Nếu không có details, thêm 1 dòng trống
      console.warn("⚠️ Invoice has no details, adding empty row");
      addDetailRow();
    }

    calculateTotal();
    document.getElementById("invoiceForm").style.display = "block";
  } catch (error) {
    console.error("Error loading invoice:", error);
    alert("Lỗi khi tải thông tin hóa đơn");
  }
}

document
  .getElementById("invoiceFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const invoiceId = document.getElementById("invoice_id").value.trim();
    const details = [];
    const rows = document.querySelectorAll(".invoice-detail-row");

    rows.forEach((row, index) => {
      const productId = row.querySelector(".detail-product").value;
      const quantity = parseInt(row.querySelector(".detail-quantity").value);
      const price = parseFloat(row.querySelector(".detail-price").value);

      if (productId && quantity && price) {
        details.push({
          detail_id: `${invoiceId}-${String(index + 1).padStart(2, "0")}`,
          product_id: productId,
          quantity: quantity,
          unit_price: price,
        });
      }
    });

    if (details.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    const discount =
      parseFloat(document.getElementById("invoice_discount").value) || 0;

    const data = {
      invoice_id: invoiceId,
      branch_id: document.getElementById("invoice_branch_id").value,
      customer_id: document.getElementById("invoice_customer_id").value || null,
      employee_id: document.getElementById("invoice_employee_id").value,
      invoice_date: document.getElementById("invoice_date").value,
      payment_method: document.getElementById("invoice_payment_method").value,
      status: document.getElementById("invoice_status").value,
      discount: discount,
      details: details,
    };

    console.log("=== SUBMIT INVOICE ===");
    console.log("Mode:", currentEditId ? "EDIT" : "CREATE");
    console.log("Data to send:", data);
    console.log("====================");

    try {
      if (currentEditId) {
        // Update existing invoice
        const totalAmount = details.reduce(
          (sum, d) => sum + d.quantity * d.unit_price,
          0
        );
        const finalAmount = totalAmount - discount;

        const updateData = {
          branch_id: data.branch_id,
          customer_id: data.customer_id,
          employee_id: data.employee_id,
          invoice_date: data.invoice_date,
          total_amount: totalAmount,
          discount: discount,
          final_amount: finalAmount,
          payment_method: data.payment_method,
          status: data.status,
          details: details, // Include details for update
        };

        console.log("=== UPDATE DATA ===");
        console.log("Update data:", updateData);
        console.log("URL:", `${API_URL}/invoices/${currentEditId}`);
        console.log("==================");

        const response = await fetch(`${API_URL}/invoices/${currentEditId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        const result = await response.json();
        console.log("Response:", result);

        alert("Cập nhật hóa đơn thành công");
      } else {
        // Create new invoice
        console.log("=== CREATE DATA ===");
        console.log("Create data:", data);
        console.log("==================");

        const response = await fetch(`${API_URL}/invoices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Response:", result);

        alert("Tạo hóa đơn thành công");
      }
      hideInvoiceForm();
      loadInvoices();
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Lỗi khi lưu hóa đơn");
    }
  });

// Attach event listeners to initial detail row
document.addEventListener("DOMContentLoaded", () => {
  const initialRow = document.querySelector(".invoice-detail-row");
  if (initialRow) {
    attachDetailEventListeners(initialRow);
  }
});

// Load initial data
loadBranches();
