// additional

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok && data.ok) {
      // ✅ Save a simple flag in browser
      localStorage.setItem("adminLoggedIn", "true");
      msg.style.color = "green";
      msg.textContent = data.message;

      // redirect to dashboard or books page
      setTimeout(() => (window.location.href = "admin.html"), 800);
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Invalid credentials";
    }
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Server error";
  }
});

// additional






document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      msg.style.color = "green";
      msg.textContent = data.message;
      // simple redirect after success
      setTimeout(() => (location.href = "admin.html"), 800);
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Login failed";
    }
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Server error";
  }
});
