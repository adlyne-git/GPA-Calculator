const form = document.getElementById("course-form");
const tableBody = document.querySelector("#course-table tbody");
const calculateBtn = document.getElementById("calculate-btn");
const gpaResult = document.getElementById("gpa-result");
const clearBtn = document.getElementById("clear-btn");
const darkToggle = document.getElementById("dark-toggle");
const downloadBtn = document.getElementById("download-btn");

// Redirect if not logged in
if (!localStorage.getItem("loggedIn")) {
	window.location.href = "signin.html";
}

const currentUserEmail = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser = users.find((u) => u.email === currentUserEmail);

if (!currentUser) {
	alert("User not found. Please log in again.");
	window.location.href = "signin.html";
}

let courses = currentUser.courses || [];

// ===========================
// Helper Functions
// ===========================
function gradeToPoint(grade) {
	const map = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
	return map[grade] ?? 0;
}

function saveUserData() {
	currentUser.courses = courses;
	localStorage.setItem("users", JSON.stringify(users));
}

function updateTable() {
	tableBody.innerHTML = "";
	courses.forEach((course, index) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${course.code}</td>
			<td>${course.unit}</td>
			<td>${course.grade}</td>
			<td>${course.point}</td>
			<td><button class="delete-btn" onclick="deleteCourse(${index})">Delete</button></td>
		`;
		tableBody.appendChild(row);
	});
}

// ===========================
// Add Course
// ===========================
document.getElementById("addCourse").addEventListener("click", () => {
	const code = document
		.getElementById("course-code")
		.value.trim()
		.toUpperCase();
	const unit = parseInt(document.getElementById("course-unit").value);
	const grade = document.getElementById("course-grade").value;

	if (!code || !unit || !grade) {
		alert("Please fill in all fields.");
		return;
	}

	const point = gradeToPoint(grade);
	courses.push({ code, unit, grade, point });
	updateTable();
	saveUserData();
	form.reset();
});

// ===========================
// Delete Course
// ===========================
function deleteCourse(index) {
	courses.splice(index, 1);
	updateTable();
	saveUserData();
}

// ===========================
// Calculate GPA
// ===========================
calculateBtn.addEventListener("click", () => {
	if (courses.length === 0) return alert("Please add at least one course.");

	let totalPoints = 0;
	let totalUnits = 0;

	courses.forEach((c) => {
		totalPoints += c.point * c.unit;
		totalUnits += c.unit;
	});

	const gpa = (totalPoints / totalUnits).toFixed(2);
	gpaResult.textContent = `Your GPA is: ${gpa}`;
});

// ===========================
// Clear All
// ===========================
clearBtn.addEventListener("click", () => {
	if (confirm("Are you sure you want to clear all courses?")) {
		courses = [];
		updateTable();
		saveUserData();
		gpaResult.textContent = "Your GPA Result Will Appear Here";
	}
});

// ===========================
// Download GPA as Image
// ===========================
downloadBtn.addEventListener("click", () => {
	html2canvas(document.querySelector("main")).then((canvas) => {
		const link = document.createElement("a");
		link.download = "GPA_Result.png";
		link.href = canvas.toDataURL();
		link.click();
	});
});

// ===========================
// Initialize Table on Load
// ===========================
updateTable();
