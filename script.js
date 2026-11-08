/* =========================================================
   EventHub - script.js
   Features: events data, search, category filter, sort,
   detail modal, validated registration form, confirmation,
   localStorage registrations, countdown timers, dark mode.
   ========================================================= */

/* ---------- Event data ---------- */
const events = [
  {
    id: 1,
    name: "CodeSprint Hackathon 2026",
    category: "Technology",
    date: "2026-12-12T09:00:00",
    venue: "KIIT Campus 14, Bhubaneswar",
    price: 0,
    seats: 300,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=70",
    description: "A 24-hour hackathon where teams build innovative solutions to real-world problems. Mentorship from industry experts, swag and cash prizes for the top teams."
  },
  {
    id: 2,
    name: "Neon Nights Music Festival",
    category: "Music",
    date: "2026-12-20T18:00:00",
    venue: "Janta Maidan, Bhubaneswar",
    price: 799,
    seats: 1500,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=70",
    description: "An electrifying evening featuring live bands, DJs and food stalls under the open sky. Bring your friends and dance till midnight."
  },
  {
    id: 3,
    name: "AI & Machine Learning Workshop",
    category: "Workshop",
    date: "2026-11-28T10:00:00",
    venue: "Auditorium, Silicon Hall",
    price: 249,
    seats: 120,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
    description: "A hands-on, beginner-friendly workshop on building and deploying your first machine learning model using Python and scikit-learn."
  },
  {
    id: 4,
    name: "Startup Pitch Summit",
    category: "Business",
    date: "2027-01-09T11:00:00",
    venue: "Convention Centre, Bhubaneswar",
    price: 499,
    seats: 400,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=70",
    description: "Watch founders pitch to investors, network with entrepreneurs and learn how ideas become funded companies."
  },
  {
    id: 5,
    name: "Inter-College Football Cup",
    category: "Sports",
    date: "2027-01-17T15:30:00",
    venue: "Kalinga Stadium Grounds",
    price: 99,
    seats: 800,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=70",
    description: "Sixteen college teams, one trophy. Cheer for your favourite team in a weekend of fast-paced knockout football."
  },
  {
    id: 6,
    name: "Art & Design Expo",
    category: "Art",
    date: "2027-02-06T10:30:00",
    venue: "Rabindra Mandap Gallery",
    price: 150,
    seats: 250,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=70",
    description: "Explore paintings, digital art, installations and live sketching sessions by emerging artists and designers."
  },
  {
    id: 7,
    name: "Web Dev Bootcamp: React Zero to Hero",
    category: "Workshop",
    date: "2027-02-14T09:30:00",
    venue: "Online (Zoom) + Lab 3",
    price: 0,
    seats: 200,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=70",
    description: "A full-day bootcamp covering React fundamentals, hooks, routing and deployment. Build and ship a mini project by the end of the day."
  },
  {
    id: 8,
    name: "Classical Dance & Culture Evening",
    category: "Music",
    date: "2027-02-27T17:30:00",
    venue: "Utkal Mandap, Bhubaneswar",
    price: 300,
    seats: 350,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=70",
    description: "An evening celebrating Odissi and other classical art forms with performances by renowned artists."
  },
  {
    id: 9,
    name: "Cyber Security Capture the Flag",
    category: "Technology",
    date: "2027-03-06T10:00:00",
    venue: "Computer Centre, Block B",
    price: 100,
    seats: 150,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=70",
    description: "Test your hacking skills in a beginner-friendly CTF with challenges in web security, cryptography and forensics."
  }
];

/* ---------- State ---------- */
const STORAGE_KEY = "eventhub_registrations";
let activeCategory = "All";
let searchQuery = "";
let sortBy = "date";
let currentEventId = null;
let modalTimerId = null;

/* ---------- DOM helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const grid = $("#eventGrid");
const emptyState = $("#emptyState");

/* ---------- LocalStorage ---------- */
function getRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveRegistrations(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    showToast("Could not save to browser storage.");
  }
}
function isRegistered(eventId) {
  return getRegistrations().some((r) => r.eventId === eventId);
}

/* ---------- Formatting ---------- */
function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit"
  });
}
function formatPrice(p) {
  return p === 0 ? "Free" : "₹" + p.toLocaleString("en-IN");
}
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast.id);
  showToast.id = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---------- Filters ---------- */
function getFilteredEvents() {
  const q = searchQuery.trim().toLowerCase();
  let list = events.filter((e) => {
    const matchesCat = activeCategory === "All" || e.category === activeCategory;
    const haystack = `${e.name} ${e.venue} ${e.category} ${e.description}`.toLowerCase();
    return matchesCat && (!q || haystack.includes(q));
  });
  if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "price") list.sort((a, b) => a.price - b.price);
  else list.sort((a, b) => new Date(a.date) - new Date(b.date));
  return list;
}

function renderChips() {
  const cats = ["All", ...new Set(events.map((e) => e.category))];
  $("#categoryChips").innerHTML = cats
    .map((c) => `<button class="chip ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

/* ---------- Render event cards ---------- */
function renderEvents() {
  const list = getFilteredEvents();
  emptyState.hidden = list.length > 0;
  grid.innerHTML = list.map((e, i) => `
    <article class="card" style="animation-delay:${Math.min(i, 8) * 70}ms">
      <div class="card-img">
        <img src="${e.image}" alt="${e.name}" loading="lazy" onerror="this.style.display='none'" />
        <span class="card-tag">${e.category}</span>
        <span class="card-price">${formatPrice(e.price)}</span>
      </div>
      <div class="card-body">
        <h3>${e.name}</h3>
        <div class="card-meta">
          <span>📅 ${formatDate(e.date)}</span>
          <span>📍 ${e.venue}</span>
        </div>
        ${isRegistered(e.id) ? '<div class="registered-flag">✔ You are registered</div>' : ""}
        <p class="card-desc">${e.description.length > 90 ? e.description.slice(0, 90) + "…" : e.description}</p>
        <div class="card-actions">
          <button class="btn btn-outline" data-details="${e.id}">View Details</button>
          <button class="btn btn-primary" data-register="${e.id}">Register</button>
        </div>
      </div>
    </article>
  `).join("");
}

/* ---------- Stats & registrations list ---------- */
function updateStats() {
  const count = getRegistrations().length;
  $("#statEvents").textContent = events.length;
  $("#statCats").textContent = new Set(events.map((e) => e.category)).size;
  $("#statRegs").textContent = count;
  $("#regBadge").textContent = count;
}

function renderRegistrations() {
  const list = getRegistrations();
  const box = $("#regList");
  if (!list.length) {
    box.innerHTML = `<div class="reg-empty">You haven't registered for any events yet. Pick one above!</div>`;
    return;
  }
  box.innerHTML = "";
  list.forEach((r) => {
    const ev = events.find((e) => e.id === r.eventId);
    const item = document.createElement("div");
    item.className = "reg-item";

    const info = document.createElement("div");
    const h = document.createElement("h4");
    h.textContent = ev ? ev.name : "Unknown event";
    const p1 = document.createElement("p");
    p1.textContent = `${r.name} · ${r.email} · ${r.phone}`;
    const p2 = document.createElement("p");
    p2.textContent = `Booking ID: ${r.bookingId} · ${ev ? formatDate(ev.date) : ""}`;
    info.append(h, p1, p2);

    const btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm";
    btn.textContent = "Cancel";
    btn.addEventListener("click", () => cancelRegistration(r.bookingId));

    item.append(info, btn);
    box.appendChild(item);
  });
}

function cancelRegistration(bookingId) {
  if (!confirm("Cancel this registration?")) return;
  saveRegistrations(getRegistrations().filter((r) => r.bookingId !== bookingId));
  refreshAll();
  showToast("Registration cancelled.");
}

function refreshAll() {
  renderEvents();
  renderRegistrations();
  updateStats();
}

/* ---------- Countdown ---------- */
function countdownHTML(targetIso) {
  const diff = new Date(targetIso) - new Date();
  if (diff <= 0) return `<div class="cd-ended">This event has started or ended</div>`;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const box = (v, l) => `<div class="cd-box"><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`;
  return box(d, "Days") + box(h, "Hours") + box(m, "Mins") + box(s, "Secs");
}

function nextEvent() {
  const now = new Date();
  return events
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
}

function tickHero() {
  const ev = nextEvent();
  if (!ev) {
    $("#heroCountdown").hidden = true;
    return;
  }
  $("#heroEventName").textContent = ev.name;
  $("#heroTimer").innerHTML = countdownHTML(ev.date);
}

/* ---------- Modal ---------- */
function openModal(eventId, scrollToForm = false) {
  const ev = events.find((e) => e.id === eventId);
  if (!ev) return;
  currentEventId = eventId;

  $("#modalView").hidden = false;
  $("#successView").hidden = true;
  $("#modalImage").style.backgroundImage = `url("${ev.image}")`;
  $("#modalCategory").textContent = ev.category;
  $("#modalTitle").textContent = ev.name;
  $("#modalDate").textContent = formatDate(ev.date);
  $("#modalVenue").textContent = ev.venue;
  $("#modalPrice").textContent = formatPrice(ev.price);
  $("#modalSeats").textContent = `${ev.seats} seats`;
  $("#modalDesc").textContent = ev.description;

  // Populate event select
  $("#eventSelect").innerHTML =
    `<option value="">-- Select an event --</option>` +
    events.map((e) => `<option value="${e.id}">${e.name}</option>`).join("");
  $("#eventSelect").value = ev.id;

  clearFormState();

  const tick = () => ($("#modalTimer").innerHTML = countdownHTML(ev.date));
  tick();
  clearInterval(modalTimerId);
  modalTimerId = setInterval(tick, 1000);

  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (scrollToForm) {
    setTimeout(() => $("#regForm").scrollIntoView({ behavior: "smooth", block: "center" }), 350);
  }
}

function closeModal() {
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearInterval(modalTimerId);
}

/* ---------- Form validation ---------- */
const validators = {
  fullName(v) {
    if (!v.trim()) return "Please enter your full name.";
    if (v.trim().length < 3) return "Name must be at least 3 characters.";
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v.trim())) return "Name can only contain letters and spaces.";
    return "";
  },
  email(v) {
    if (!v.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Enter a valid email (e.g. name@example.com).";
    return "";
  },
  phone(v) {
    if (!v.trim()) return "Please enter your phone number.";
    if (!/^[6-9]\d{9}$/.test(v.trim())) return "Enter a valid 10-digit mobile number starting with 6-9.";
    return "";
  },
  eventSelect(v) {
    return v ? "" : "Please select an event.";
  }
};
const errorIds = { fullName: "nameError", email: "emailError", phone: "phoneError", eventSelect: "eventError" };

function validateField(id) {
  const input = $("#" + id);
  const msg = validators[id](input.value);
  $("#" + errorIds[id]).textContent = msg;
  const wrap = input.closest(".field");
  wrap.classList.toggle("invalid", !!msg);
  wrap.classList.toggle("valid", !msg);
  return !msg;
}

function clearFormState() {
  $("#regForm").reset();
  if (currentEventId) $("#eventSelect").value = currentEventId;
  Object.keys(errorIds).forEach((id) => {
    $("#" + errorIds[id]).textContent = "";
    $("#" + id).closest(".field").classList.remove("invalid", "valid");
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const results = Object.keys(validators).map(validateField);
  if (results.includes(false)) {
    showToast("Please fix the highlighted fields.");
    return;
  }

  const eventId = Number($("#eventSelect").value);
  const email = $("#email").value.trim().toLowerCase();

  // Prevent duplicate registration (same email + same event)
  const duplicate = getRegistrations().some((r) => r.eventId === eventId && r.email.toLowerCase() === email);
  if (duplicate) {
    $("#emailError").textContent = "This email is already registered for the selected event.";
    $("#email").closest(".field").classList.add("invalid");
    return;
  }

  const registration = {
    bookingId: "EH" + Date.now().toString(36).toUpperCase(),
    eventId,
    name: $("#fullName").value.trim(),
    email: $("#email").value.trim(),
    phone: $("#phone").value.trim(),
    registeredAt: new Date().toISOString()
  };

  const list = getRegistrations();
  list.push(registration);
  saveRegistrations(list);

  showSuccess(registration);
  refreshAll();
}

function showSuccess(reg) {
  const ev = events.find((x) => x.id === reg.eventId);
  $("#modalView").hidden = true;
  $("#successView").hidden = false;
  $("#successMsg").textContent = `Thank you, ${reg.name}! A confirmation has been recorded for your registration.`;

  const rows = [
    ["Booking ID", reg.bookingId],
    ["Event", ev.name],
    ["Date", formatDate(ev.date)],
    ["Venue", ev.venue],
    ["Email", reg.email],
    ["Phone", reg.phone]
  ];
  const ticket = $("#ticket");
  ticket.innerHTML = "";
  rows.forEach(([k, v]) => {
    const row = document.createElement("div");
    const a = document.createElement("span");
    a.textContent = k;
    const b = document.createElement("strong");
    b.textContent = v;
    row.append(a, b);
    ticket.appendChild(row);
  });
  clearInterval(modalTimerId);
}

/* ---------- Theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("#themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("eventhub_theme", theme); } catch {}
}
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("eventhub_theme"); } catch {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((i) => io.observe(i));
}

/* ---------- Event listeners ---------- */
function bindEvents() {
  // Search (debounced)
  let debounce;
  $("#searchInput").addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = e.target.value;
      renderEvents();
    }, 200);
  });

  $("#sortSelect").addEventListener("change", (e) => {
    sortBy = e.target.value;
    renderEvents();
  });

  // Category chips (event delegation)
  $("#categoryChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    renderChips();
    renderEvents();
  });

  // Card buttons (event delegation)
  grid.addEventListener("click", (e) => {
    const d = e.target.closest("[data-details]");
    const r = e.target.closest("[data-register]");
    if (d) openModal(Number(d.dataset.details));
    if (r) openModal(Number(r.dataset.register), true);
  });

  $("#resetFilters").addEventListener("click", () => {
    activeCategory = "All";
    searchQuery = "";
    $("#searchInput").value = "";
    renderChips();
    renderEvents();
  });

  // Modal
  $("#modalClose").addEventListener("click", closeModal);
  $("#successClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Form: live validation
  const form = $("#regForm");
  form.addEventListener("submit", handleSubmit);
  Object.keys(validators).forEach((id) => {
    const el = $("#" + id);
    el.addEventListener("blur", () => validateField(id));
    el.addEventListener("input", () => {
      if (el.closest(".field").classList.contains("invalid")) validateField(id);
    });
  });
  // Only allow digits in phone
  $("#phone").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  // Theme + mobile menu
  $("#themeToggle").addEventListener("click", () => {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "✕" : "☰";
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("open");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Navbar shadow on scroll
  window.addEventListener("scroll", () => {
    $("#navbar").classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

/* ---------- Init ---------- */
function init() {
  initTheme();
  $("#year").textContent = new Date().getFullYear();
  renderChips();
  refreshAll();
  tickHero();
  setInterval(tickHero, 1000);
  bindEvents();
  initReveal();
}
document.addEventListener("DOMContentLoaded", init);
