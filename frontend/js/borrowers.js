let allBorrowers = []; // global list for searching

async function loadBooksForSelect() {
  const sel = document.getElementById("bookSelect");
  sel.innerHTML = "<option>Loading...</option>";
  const res = await fetch("/api/books");
  const books = await res.json();
  sel.innerHTML = "";
  books.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b._id;
    opt.textContent = `${b.name} (${b.quantity})`;
    sel.appendChild(opt);
  });
}

async function loadBorrowers() {
  const t = document.querySelector("#tableBorrowers tbody");
  t.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";
  const res = await fetch("/api/borrowers");
  const items = await res.json();
  allBorrowers = items; // store all borrowers
  renderBorrowers(items);
}

function renderBorrowers(items) {
  const t = document.querySelector("#tableBorrowers tbody");
  t.innerHTML = "";
  if (!items.length) {
    t.innerHTML = "<tr><td colspan='6'>No borrowers found</td></tr>";
    return;
  }
  items.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.name}</td>
      <td>${b.email}</td>
      <td>${b.phone}</td>
      <td>${b.bookId ? b.bookId.name : "—"}</td>
      <td>${new Date(b.borrowDate).toLocaleDateString()}</td>
      <td>${new Date(b.returnDate).toLocaleDateString()}</td>
      <td><button data-id="${b._id}" class="delBtn">Delete</button></td>
    `;
    t.appendChild(tr);
  });

  document.querySelectorAll(".delBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete borrower and return book?")) return;
      const id = btn.dataset.id;
      await fetch(`/api/borrowers/${id}`, { method: "DELETE" });
      await loadBorrowers();
      await loadBooksForSelect();
    });
  });
}

// 🔍 Search function
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!query) return renderBorrowers(allBorrowers);
  const filtered = allBorrowers.filter(
    (b) =>
      b.name.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      (b.bookId && b.bookId.name.toLowerCase().includes(query))
  );
  renderBorrowers(filtered);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderBorrowers(allBorrowers);
});

document
  .getElementById("borrowerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const designation = document.getElementById("designation").value;
    const bookId = document.getElementById("bookSelect").value;
    const returnDate = document.getElementById("returnDate").value;
    const msg = document.getElementById("borrowMsg");

    try {
      const res = await fetch("/api/borrowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          designation,
          bookId,
          returnDate,
        }),
      });
      if (res.ok) {
        msg.style.color = "green";
        msg.textContent = "Borrower added";
        await loadBorrowers();
        await loadBooksForSelect();
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

window.addEventListener("load", async () => {
  await loadBooksForSelect();
  await loadBorrowers();
});
