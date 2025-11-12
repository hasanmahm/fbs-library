let allBooks = []; // store all books globally

async function loadBooks() {
  const t = document.querySelector("#tableBooks tbody");
  t.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";
  const res = await fetch("/api/books");
  const books = await res.json();
  allBooks = books; // store globally
  renderBooks(books);
}

function renderBooks(books) {
  const t = document.querySelector("#tableBooks tbody");
  t.innerHTML = "";
  if (!books.length) {
    t.innerHTML = "<tr><td colspan='6'>No books found</td></tr>";
    return;
  }
  books.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.name}</td>
      <td>${b.author}</td>
      <td>${b.quantity}</td>
      <td>${b.type}</td>
      <td>${b.price}</td>
      <td><button data-id="${b._id}" class="del">Delete</button></td>
    `;
    t.appendChild(tr);
  });
  document.querySelectorAll(".del").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete book?")) return;
      await fetch(`/api/books/${btn.dataset.id}`, { method: "DELETE" });
      loadBooks();
    });
  });
}

// 🔍 New search logic
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!query) return renderBooks(allBooks);
  const filtered = allBooks.filter(
    (b) =>
      b.name.toLowerCase().includes(query) ||
      (b.author && b.author.toLowerCase().includes(query)) ||
      (b.type && b.type.toLowerCase().includes(query))
  );
  renderBooks(filtered);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderBooks(allBooks);
});

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("bName").value.trim();
  const author = document.getElementById("bAuthor").value.trim();
  const price = parseFloat(document.getElementById("bPrice").value) || 0;
  const quantity = parseInt(document.getElementById("bQuantity").value) || 1;
  const type = document.getElementById("bType").value;
  const msg = document.getElementById("bookMsg");
  try {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, author, price, quantity, type }),
    });
    if (res.ok) {
      msg.style.color = "green";
      msg.textContent = "Added";
      loadBooks();
    } else {
      const d = await res.json();
      msg.style.color = "red";
      msg.textContent = d.error || "Failed";
    }
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Server error";
  }
});

window.addEventListener("load", loadBooks);
