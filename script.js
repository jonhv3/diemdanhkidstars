import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Add student
document.getElementById("addStudentButton").addEventListener("click", async () => {
    const name = document.getElementById("newStudentName").value;
    const classes = Array.from(document.querySelectorAll("#classesSelection input:checked")).map(el => el.value);

    if (!name || classes.length === 0) {
        alert("Vui lòng nhập tên và chọn ít nhất một lớp.");
        return;
    }

    await addDoc(collection(db, "students"), { name, classes });
    alert("Học sinh đã được thêm thành công!");
});

// Mark attendance
document.getElementById("markAttendanceButton").addEventListener("click", async () => {
    const name = document.getElementById("attendanceStudentName").value;
    const date = document.getElementById("attendanceDate").value;
    const time = document.getElementById("attendanceTime").value;
    const classes = Array.from(document.querySelectorAll("#classesAttendanceSelection input:checked")).map(el => el.value);

    if (!name || !date || !time || classes.length === 0) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    await addDoc(collection(db, "attendance"), {
        name,
        date: Timestamp.fromDate(new Date(`${date}T${time}`)),
        classes
    });

    alert("Điểm danh thành công!");
    renderAttendanceTable();
});

// Render attendance table
async function renderAttendanceTable() {
    const querySnapshot = await getDocs(collection(db, "attendance"));
    const tbody = document.querySelector("#attendanceTable tbody");
    tbody.innerHTML = "";

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const row = `
            <tr>
                <td>${data.name}</td>
                <td>${data.date.toDate().toLocaleDateString()}</td>
                <td>${data.date.toDate().toLocaleTimeString()}</td>
                <td>${data.classes.join(", ")}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

renderAttendanceTable();
