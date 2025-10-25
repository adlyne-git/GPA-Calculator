const form = document.getElementById('course-form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stops the form from refreshing the page
});
const tableBody = document.querySelector('#course-table tbody');
const calculateBtn = document.getElementById('calculate-btn');
const gpaResult = document.getElementById('gpa-result');

let courses = [];

// Load courses from localStorage when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    courses = JSON.parse(storedCourses);
    updateTable();
  }

  // Load saved GPA result if available
  const savedGPA = localStorage.getItem('gpa');
  if (savedGPA) {
    gpaResult.textContent = `Your GPA is: ${savedGPA}`;
  }
});

function gradeToPoint(grade) {
  switch (grade) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    case 'F': return 0;
    default: return 0;
  }
}

// Add course
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const code = document.getElementById('course-code').value.trim();
  const unit = parseInt(document.getElementById('course-unit').value);
  const grade = document.getElementById('course-grade').value;

  if (!code || !unit || !grade) return alert('Please fill in all fields.');

  const point = gradeToPoint(grade);
  const course = { code, unit, grade, point };
  
  courses.push(course);
  updateTable();
  saveCourses(); // Save to localStorage
  form.reset();
});

// Update table display
function updateTable() {
  tableBody.innerHTML = '';
  courses.forEach((course, index) => {
    const row = document.createElement('tr');
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

// Save courses to localStorage
function saveCourses() {
  localStorage.setItem('courses', JSON.stringify(courses));
}

// Delete a course
function deleteCourse(index) {
  courses.splice(index, 1);
  updateTable();
  saveCourses(); // Save updated list
}

// Calculate GPA
calculateBtn.addEventListener('click', () => {
  if (courses.length === 0) return alert('Please add at least one course.');

  let totalPoints = 0;
  let totalUnits = 0;

  courses.forEach(course => {
    totalPoints += course.point * course.unit;
    totalUnits += course.unit;
  });

  const gpa = (totalPoints / totalUnits).toFixed(2);
  gpaResult.textContent = `Your GPA is: ${gpa}`;

  // Show success popup
const popup = document.getElementById('success-popup');
popup.style.display = 'block';
setTimeout(() => popup.style.display = 'none', 3000);

  // Save GPA result
  localStorage.setItem('gpa', gpa);
});
// Clear all data
const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all data?')) {
    courses = [];
    updateTable();
    localStorage.removeItem('courses');
    localStorage.removeItem('gpa');
    gpaResult.textContent = 'Your GPA will appear here';
  }
});

// CGPA Calculator
const calcCGPABtn = document.getElementById('calc-cgpa');
const cgpaResult = document.getElementById('cgpa-result');

calcCGPABtn.addEventListener('click', () => {
  const prevGPA = parseFloat(document.getElementById('prev-gpa').value);
  const prevUnits = parseFloat(document.getElementById('prev-units').value);

  if (isNaN(prevGPA) || isNaN(prevUnits) || courses.length === 0) {
    return alert('Enter valid previous data and current courses.');
  }

  let totalPoints = 0;
  let totalUnits = 0;

  courses.forEach(course => {
    totalPoints += course.point * course.unit;
    totalUnits += course.unit;
  });

  const newCGPA = ((prevGPA * prevUnits) + totalPoints) / (prevUnits + totalUnits);
  cgpaResult.textContent = `Your CGPA is: ${newCGPA.toFixed(2)}`;
});

// Dark Mode Toggle
const darkToggle = document.getElementById('dark-toggle');

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  // Save mode to localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});

// Download Result as Image
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', () => {
  html2canvas(document.querySelector('main')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'gpa_result.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});