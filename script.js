// WhatsApp number in international format (no +).
const WHATSAPP_NUMBER = "917088614407";

let PRODUCTS = [];
let filtered = [];

const els = {
  grid: document.getElementById("productsGrid"),
  cat: document.getElementById("categoryFilter"),
  search: document.getElementById("searchInput"),
  waLink: document.getElementById("waLink")
};

// Footer year + contact link
document.getElementById("year").textContent = new Date().getFullYear();
els.waLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;

// Load products.json and initialize
fetch("products.json")
  .then(r => r.json())
  .then(data => {
    PRODUCTS = data;
    initCategories(PRODUCTS);
    filtered = PRODUCTS.slice();
    render();
  })
  .catch(() => {
    els.grid.innerHTML = "<p>Could not load products. Please refresh.</p>";
  });

// Build category list
function initCategories(list){
  const cats = Array.from(new Set(list.map(p => p.category))).sort();
  for(const c of cats){
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    els.cat.appendChild(opt);
  }
}

// Apply filters
function applyFilters(){
  const q = els.search.value.trim().toLowerCase();
  const cat = els.cat.value;

  filtered = PRODUCTS.filter(p => {
    const inCat = (cat === "All" || p.category === cat);
    const hay = [p.name, p.description, (p.tags||[]).join(" ")].join(" ").toLowerCase();
    const inSearch = hay.includes(q);
    return inCat && inSearch;
  });
  render();
}

// Render cards
function render(){
  if(filtered.length === 0){
    els.grid.innerHTML = "<p>No products found. Try another search or category.</p>";
    return;
  }
  els.grid.innerHTML = filtered.map(cardHTML).join("");
}

// Product card
function cardHTML(p){
  const text = encodeURIComponent(`Hello! I'm interested in "${p.name}" (₹${p.price}). Is it available?`);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  return `
    <article class="card">
      <img src="assets/images/${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
      <div class="card-body">
        <h4 class="card-title">${escapeHtml(p.name)}</h4>
        <div class="price">₹${p.price}</div>
        <div class="card-desc">${escapeHtml(p.description || "")}</div>
        <div class="card-actions">
          <a class="primary" href="${wa}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

els.cat.addEventListener("change", applyFilters);
els.search.addEventListener("input", applyFilters);