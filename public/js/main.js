// Wait until the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  
  // Extract the 'token' parameter from the URL query string
  const token = new URLSearchParams(window.location.search).get('token');

  // Get the form element by its ID
  const form = document.getElementById('profileForm');

  // Add a submit event listener to the form
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Convert form data into a plain JavaScript object
    const formData = Object.fromEntries(new FormData(form).entries());

    // Include the token in the payload to be sent to the server
    const payload = { ...formData, token };

    // Send the payload to the '/update' endpoint using a POST request
    const res = await fetch('/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
        'Authorization': `Bearer ${token}`  // Include token in Authorization header
      },
      body: JSON.stringify(payload) // Convert payload to JSON string
    });

    // Display the server response message to the user
    const msg = document.getElementById('message');
    msg.textContent = await res.text(); // Set the message text from response
    msg.style.display = 'block';        // Make the message element visible
  });
});