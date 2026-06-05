const API_BASE = "http://127.0.0.1:8000/api/v1";
let authToken = null;

// Login
document.getElementById("adminLoginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.status === "success") {
    authToken = data.token;
    alert("Login successful!");
    loadAdminData();
  } else {
    alert("Login failed: " + data.message);
  }
});

// Utility: API request with JWT
async function apiRequest(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

// Utility: render list items with edit/delete buttons
function renderList(containerId, items, formatter) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(item => {
    container.innerHTML += formatter(item);
  });
}

// Load existing data
async function loadAdminData() {
  try {
    // Students
    const studentsRes = await apiRequest(`${API_BASE}/students`);
    const studentsData = await studentsRes.json();
    if (studentsData.status === "success") {
      renderList("studentList", studentsData.data, s =>
        `<p>ID ${s.student_id}: ${s.first_name} ${s.last_name} (${s.email})
          <button onclick="deleteStudent(${s.student_id})" class="btn-cyber">Delete</button>
          <button onclick="editStudent(${s.student_id})" class="btn-cyber">Edit</button>
        </p>`
      );
    }

    // Teachers
    const teachersRes = await apiRequest(`${API_BASE}/teachers`);
    const teachersData = await teachersRes.json();
    if (teachersData.status === "success") {
      renderList("teacherList", teachersData.data, t =>
        `<p>ID ${t.teacher_id}: ${t.first_name} ${t.last_name} (${t.email})
          <button onclick="deleteTeacher(${t.teacher_id})" class="btn-cyber">Delete</button>
          <button onclick="editTeacher(${t.teacher_id})" class="btn-cyber">Edit</button>
        </p>`
      );
    }

    // Invoices
    const invoicesRes = await apiRequest(`${API_BASE}/invoices`);
    const invoicesData = await invoicesRes.json();
    if (invoicesData.status === "success") {
      renderList("invoiceList", invoicesData.data, inv =>
        `<p>ID ${inv.invoice_id}: Student ${inv.student_id}, PKR ${inv.total_amount}, Status: ${inv.status}
                    <button onclick="deleteInvoice(${inv.invoice_id})" class="btn-cyber">Delete</button>
          <button onclick="editInvoice(${inv.invoice_id})" class="btn-cyber">Edit</button>
        </p>`
      );
    }

    // Classes
    const classesRes = await apiRequest(`${API_BASE}/classes`);
    const classesData = await classesRes.json();
    if (classesData.status === "success") {
      renderList("classList", classesData.data, c =>
        `<p>ID ${c.class_id}: ${c.class_name} (Room ${c.room_number})
          <button onclick="deleteClass(${c.class_id})" class="btn-cyber">Delete</button>
          <button onclick="editClass(${c.class_id})" class="btn-cyber">Edit</button>
        </p>`
      );
    }
  } catch (err) {
    console.error("Error loading admin data:", err);
  }
}

// CRUD Handlers
async function deleteStudent(id) {
  await apiRequest(`${API_BASE}/students/${id}`, { method: "DELETE" });
  await loadAdminData();
}
async function editStudent(id) {
  const newName = prompt("Enter new student name:");
  const newEmail = prompt("Enter new student email:");
  if (newName && newEmail) {
    const [first_name, last_name] = newName.split(" ");
    await apiRequest(`${API_BASE}/students/${id}`, {
      method: "PUT",
      body: JSON.stringify({ first_name, last_name, email: newEmail, phone: "0000000000", class_id: 1 })
    });
    await loadAdminData();
  }
}

async function deleteTeacher(id) {
  await apiRequest(`${API_BASE}/teachers/${id}`, { method: "DELETE" });
  await loadAdminData();
}
async function editTeacher(id) {
  const newName = prompt("Enter new teacher name:");
  const newEmail = prompt("Enter new teacher email:");
  if (newName && newEmail) {
    const [first_name, last_name] = newName.split(" ");
    await apiRequest(`${API_BASE}/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify({ first_name, last_name, email: newEmail, phone: "0000000000", hire_date: new Date().toISOString().split("T")[0], subject: "General" })
    });
    await loadAdminData();
  }
}

async function deleteInvoice(id) {
  await apiRequest(`${API_BASE}/invoices/${id}`, { method: "DELETE" });
  await loadAdminData();
}
async function editInvoice(id) {
  const newAmount = prompt("Enter new invoice amount:");
  const newStatus = prompt("Enter new status (Pending/Paid):");
  if (newAmount && newStatus) {
    await apiRequest(`${API_BASE}/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify({ total_amount: newAmount, due_date: new Date().toISOString().split("T")[0], status: newStatus })
    });
    await loadAdminData();
  }
}

async function deleteClass(id) {
  await apiRequest(`${API_BASE}/classes/${id}`, { method: "DELETE" });
  await loadAdminData();
}
async function editClass(id) {
  const newName = prompt("Enter new class name:");
  const newRoom = prompt("Enter new room number:");
  if (newName && newRoom) {
    await apiRequest(`${API_BASE}/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ class_name: newName, room_number: newRoom })
    });
    await loadAdminData();
  }
}

// Initialize after login
document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin.js loaded. Please login first.");
});
