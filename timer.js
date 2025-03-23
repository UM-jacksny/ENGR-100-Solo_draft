const timeInput = document.getElementById('time');
const emailInput = document.getElementById('email');

startButton.addEventListener('click', () => {
  const assignmentId = assignmentDropdown.value;
  const minutes = parseInt(timeInput.value);
  const email = emailInput.value;

  if (!assignmentId || isNaN(minutes) || !email) {
    alert('Please fill out all fields.');
    return;
  }

  const endTime = Date.now() + minutes * 60 * 1000;

  const checkTimer = setInterval(() => {
    const remainingTime = endTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(checkTimer);
      checkSubmission(assignmentId, email);
    }
  }, 1000);

  alert(`Timer set for ${minutes} minutes.`);
});

function checkSubmission(assignmentId, email) {
  fetch(`https://canvas.instructure.com/api/v1/courses/${courseDropdown.value}/assignments/${assignmentId}/submissions/self`, options)
    .then(response => response.json())
    .then(submission => {
      if (!submission.submitted_at) {
        sendEmailNotification(email);
      } else {
        alert('Assignment submitted on time!');
      }
    })
    .catch(error => console.error('Error checking submission:', error));
}

function sendEmailNotification(email) {
  const name = localStorage.getItem('userName');
  
  fetch('/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name })
  })
  .then(() => alert('Email sent to your accountability partner.'))
  .catch(error => console.error('Error sending email:', error));
}


function getUserName() {
  fetch('https://canvas.instructure.com/api/v1/users/self/profile', options)
    .then(response => response.json())
    .then(data => {
      const userName = data.name;
      localStorage.setItem('userName', userName); // Store it for later use
    })
    .catch(error => console.error('Error fetching user name:', error));
}

getUserName();
