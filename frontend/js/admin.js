async function loadStats() {
  const booksRes = await fetch("/api/books");
  const books = await booksRes.json();
  const borrowersRes = await fetch("/api/borrowers");
  const borrowers = await borrowersRes.json();

  const totalBooks = books.reduce ((s,b) => s +  (b.quantity || 0), 0);
  const totalBorrowers = borrowers.length;
  const totalRemain = books.reduce((s, b) => s + (b.quantity || 0), 0);
  // last 30 days
  const now = new Date();
  const days30 = new Date();
  days30.setDate(now.getDate() - 30);
  const borrowed30 = borrowers.filter(
    (b) => new Date(b.borrowDate) >= days30
  ).length;

  const totalBooksCount = totalBorrowers+totalRemain;

  document.getElementById("totalBooksCategory").textContent = books.length;
  document.getElementById("totalBooks").textContent = totalBooksCount;
  document.getElementById("totalBorrowers").textContent = totalBorrowers;
  document.getElementById("booksRemaining").textContent = totalRemain;
  document.getElementById("borrow30").textContent = borrowed30;

}

window.addEventListener("load", loadStats);
