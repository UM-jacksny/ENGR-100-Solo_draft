const courseDropdown = document.getElementById('course');
const assignmentDropdown = document.getElementById('assignment');
const tokenInput = document.getElementById('token');
const startButton = document.getElementById('start');

let options;

tokenInput.addEventListener('input', () => {
  const token = tokenInput.value;
  options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  };
  fetchCourses();
});

function fetchCourses() {
  fetch('https://canvas.instructure.com/api/v1/courses', options)
    .then((response) => response.json())
    .then((courses) => {
      const filteredCourses = courses.filter((course) => !course.access_restricted_by_date);
      courseDropdown.innerHTML = '<option value="">Select a Course</option>';
      filteredCourses.forEach((course) => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseDropdown.appendChild(option);
      });
      courseDropdown.disabled = false;
    })
    .catch((error) => console.error('Error fetching courses:', error));
}

courseDropdown.addEventListener('change', () => {
  const courseId = courseDropdown.value;
  if (!courseId) return;

  fetch(`https://canvas.instructure.com/api/v1/courses/${courseId}/assignments`, options)
    .then((response) => response.json())
    .then((assignments) => {
      assignmentDropdown.innerHTML = '<option value="">Select an Assignment</option>';
      assignments.forEach((assignment) => {
        const option = document.createElement('option');
        option.value = assignment.id;
        option.textContent = assignment.name;
        assignmentDropdown.appendChild(option);
      });
      assignmentDropdown.disabled = false;
    })
    .catch((error) => console.error('Error fetching assignments:', error));
});
