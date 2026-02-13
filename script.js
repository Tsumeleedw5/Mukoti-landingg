// ===============================
// Mukoti Landing Page - script.js
// EmailJS + WhatsApp prefills + /img loader + results gallery
// ===============================

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => nav.classList.toggle("show-nav"));
  document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("show-nav")));
}

// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Company contact
const COMPANY_EMAIL = "info@mukoticleaning.co.za";
const WHATSAPP_NUMBER_INTL = "27681087266";

// ✅ Put your working EmailJS keys here (from your main website setup)
const EMAILJS_PUBLIC_KEY = "PASTE_YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "PASTE_YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "PASTE_YOUR_TEMPLATE_ID";

// Elements
const quoteForm = document.getElementById("quoteForm");
const note = document.getElementById("formNote");
const whatsappQuoteBtn = document.getElementById("whatsappQuoteBtn");
const mailtoBtn = document.getElementById("mailtoBtn");

const heroWhatsAppBtn = document.getElementById("heroWhatsAppBtn");
const resultsWhatsAppBtn = document.getElementById("resultsWhatsAppBtn");
const processWhatsAppBtn = document.getElementById("processWhatsAppBtn");
const faqWhatsAppBtn = document.getElementById("faqWhatsAppBtn");
const stickyWhatsAppBtn = document.getElementById("stickyWhatsAppBtn");

// -------------------------------
// Helpers
// -------------------------------
function getFormData() {
  return {
    name: document.getElementById("name")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    phone: document.getElementById("phone")?.value.trim() || "",
    service: document.getElementById("service")?.value.trim() || "",
    location: document.getElementById("location")?.value.trim() || "",
    message: document.getElementById("message")?.value.trim() || ""
  };
}

function validate(data) {
  return !!(data.name && data.email && data.phone && data.service && data.location && data.message);
}

function buildQuoteText(data) {
  return (
`Hello Mukoti Cleaning Services,

I would like to request a quote.

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}
Location: ${data.location}

Details:
${data.message}

Thank you.`
  );
}

function buildWhatsAppLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${encodeURIComponent(text)}`;
}

function buildMailtoLink(data) {
  const subject = encodeURIComponent(`Quote Request: ${data.service} - ${data.location}`);
  const body = encodeURIComponent(buildQuoteText(data));
  return `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
}

function setAllWhatsAppLinks(link) {
  [heroWhatsAppBtn, resultsWhatsAppBtn, processWhatsAppBtn, faqWhatsAppBtn, stickyWhatsAppBtn].forEach(btn => {
    if (btn) btn.href = link;
  });
}

// -------------------------------
// Prefill WhatsApp + mailto live
// -------------------------------
function refreshPrefillLinks() {
  const data = getFormData();

  const text = (data.name || data.email || data.phone || data.service || data.location || data.message)
    ? buildQuoteText({
        name: data.name || "[Your Name]",
        email: data.email || "[Your Email]",
        phone: data.phone || "[Your Phone]",
        service: data.service || "[Service]",
        location: data.location || "[Location]",
        message: data.message || "[Details]"
      })
    : "Hello Mukoti Cleaning Services, I would like to request a quote.";

  const waLink = buildWhatsAppLink(text);

  if (whatsappQuoteBtn) whatsappQuoteBtn.href = waLink;
  setAllWhatsAppLinks(waLink);

  if (mailtoBtn) mailtoBtn.href = validate(data) ? buildMailtoLink(data) : "#";
}

["name", "email", "phone", "service", "location", "message"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", refreshPrefillLinks);
    el.addEventListener("change", refreshPrefillLinks);
  }
});
refreshPrefillLinks();

// -------------------------------
// EmailJS init + send
// -------------------------------
function initEmailJS() {
  if (!window.emailjs) return;
  if (EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.includes("PASTE_")) {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
}
initEmailJS();

async function sendEmailViaEmailJS(data) {
  if (!window.emailjs) throw new Error("EmailJS not loaded.");

  if (
    !EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.includes("PASTE_") ||
    !EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.includes("PASTE_") ||
    !EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID.includes("PASTE_")
  ) {
    throw new Error("EmailJS keys not set in script.js");
  }

  // Must match your EmailJS template variables
  const params = {
    to_email: COMPANY_EMAIL,
    from_name: data.name,
    from_email: data.email,
    phone: data.phone,
    service: data.service,
    location: data.location,
    details: data.message
  };

  return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
}

if (quoteForm) {
  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = getFormData();

    if (!validate(data)) {
      if (note) note.textContent = "Please complete all fields, then try again.";
      return;
    }

    if (note) note.textContent = "Sending your quote request…";

    try {
      await sendEmailViaEmailJS(data);
      if (note) note.textContent = "✅ Sent! We’ll get back to you shortly.";
      quoteForm.reset();
      refreshPrefillLinks();
    } catch (err) {
      console.error(err);
      if (note) note.textContent = "Email failed to send automatically. Use WhatsApp or the backup email button.";
    }
  });
}

// ===============================
// IMAGE LOADER (spaces + extension fallback)
// ===============================
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

function fileUrl(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function setImgWithFallback(imgEl, baseName, folder = "img") {
  let idx = 0;
  const tryNext = () => {
    if (idx >= EXTENSIONS.length) return;
    const candidate = `${folder}/${baseName}${EXTENSIONS[idx]}`;
    imgEl.src = fileUrl(candidate);
    idx += 1;
  };
  imgEl.onerror = tryNext;
  tryNext();
}

// Logo
const siteLogo = document.getElementById("siteLogo");
if (siteLogo) setImgWithFallback(siteLogo, "horizontal logo", "img");

// Hero images (4)
const heroMap = [
  ["heroImg1", "House Cleaning 1"],
  ["heroImg2", "Couch Cleaning 4"],
  ["heroImg3", "Mattress Cleaning 2"],
  ["heroImg4", "Ndlala Mall Cleaning 1"]
];
heroMap.forEach(([id, name]) => {
  const el = document.getElementById(id);
  if (el) setImgWithFallback(el, name, "img");
});

// Quote mini images (3)
const quoteMap = [
  ["quoteImg1", "carpet"],
  ["quoteImg2", "sofa 2"],
  ["quoteImg3", "Window Cleaning 1"]
];
quoteMap.forEach(([id, name]) => {
  const el = document.getElementById(id);
  if (el) setImgWithFallback(el, name, "img");
});

// ===============================
// RESULTS GALLERY (auto render)
// ===============================
const resultsGrid = document.getElementById("resultsGrid");

const RESULTS_IMAGES = [
  { name: "House Cleaning 1", tag: "House", label: "House Cleaning" },
  { name: "Couch Cleaning 4", tag: "Couch", label: "Couch Cleaning" },
  { name: "Mattress Cleaning 2", tag: "Mattress", label: "Mattress Cleaning" },
  { name: "carpet", tag: "Carpet", label: "Carpet Cleaning" },
  { name: "rug 1", tag: "Rug", label: "Rug Cleaning" },
  { name: "Window Cleaning 1", tag: "Windows", label: "Window Cleaning" },
  { name: "Ndlala Mall Cleaning 1", tag: "Commercial", label: "Mall Cleaning" },
  { name: "Warehouse Cleaning 2", tag: "Commercial", label: "Warehouse Cleaning" },
  { name: "Couch Cleaning 2", tag: "Couch", label: "Upholstery" },
  { name: "sofa 2", tag: "Upholstery", label: "Upholstery" }
];

function renderResults() {
  if (!resultsGrid) return;

  resultsGrid.innerHTML = "";

  RESULTS_IMAGES.forEach(item => {
    const tile = document.createElement("div");
    tile.className = "result-tile";

    const img = document.createElement("img");
    img.className = "result-img";
    img.alt = `Mukoti Cleaning Services - ${item.label}`;
    img.loading = "lazy";
    setImgWithFallback(img, item.name, "img");

    const meta = document.createElement("div");
    meta.className = "result-meta";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.tag;

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = item.label;

    meta.appendChild(tag);
    meta.appendChild(label);

    tile.appendChild(img);
    tile.appendChild(meta);

    resultsGrid.appendChild(tile);
  });
}

renderResults();
