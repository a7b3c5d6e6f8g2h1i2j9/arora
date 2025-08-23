
document.querySelector("#myForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.querySelector("#name").value,
    Phone: document.querySelector("#phone").value,
    email: document.querySelector("#email").value,
    message: document.querySelector("#message").value
  };

  const response = await fetch("https://arora-backend.onrender.com/sign_up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const result = await response.json();
  if (result.success) {
    window.location.href = "/signup_successfull.html"; // redirect client-side
  } else {
    alert("Error: " + result.message);
  }
});