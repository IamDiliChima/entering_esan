// Main navigation: mobile menu toggle and automatic closing after link clicks.
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Reflective entry modal: responses are never stored, transmitted, or persisted.
const openEntryButton = document.querySelector("[data-open-entry]");
const closeEntryButton = document.querySelector("[data-close-entry]");
const entryModal = document.querySelector("[data-entry-modal]");
const entryForm = document.querySelector("[data-entry-form]");
const gatedContent = document.querySelector("[data-gated-content]");
const entryStatus = document.querySelector("[data-entry-status]");
let lastFocusedElement = null;

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

function openEntryModal() {
  if (!entryModal) return;

  lastFocusedElement = document.activeElement;
  entryModal.hidden = false;
  document.body.classList.add("modal-open");

  const focusable = getFocusableElements(entryModal);
  if (focusable.length) {
    focusable[0].focus();
  }
}

function closeEntryModal() {
  if (!entryModal) return;

  entryModal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function unlockSite() {
  if (gatedContent) gatedContent.hidden = false;
  if (entryStatus) entryStatus.hidden = false;
  closeEntryModal();

  if (gatedContent) {
    gatedContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

if (openEntryButton) {
  openEntryButton.addEventListener("click", openEntryModal);
}

if (closeEntryButton) {
  closeEntryButton.addEventListener("click", closeEntryModal);
}

if (entryModal) {
  entryModal.addEventListener("click", (event) => {
    if (event.target === entryModal) {
      closeEntryModal();
    }
  });

  entryModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEntryModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(entryModal);
    if (!focusable.length) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

if (entryForm) {
  entryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!entryForm.checkValidity()) {
      entryForm.reportValidity();
      return;
    }

    // Read and immediately discard form data so no reflection answer persists.
    new FormData(entryForm);
    entryForm.reset();
    unlockSite();
  });
}

// Optional video embed: no YouTube request is made until the visitor clicks.
const loadVideoButton = document.querySelector("[data-load-video]");

if (loadVideoButton) {
  loadVideoButton.addEventListener("click", () => {
    const videoPanel = loadVideoButton.closest("[data-video-panel]");
    const videoSrc = loadVideoButton.getAttribute("data-video-src");

    if (!videoPanel || !videoSrc) return;

    const frame = document.createElement("iframe");
    frame.className = "video-frame";
    frame.src = videoSrc;
    frame.title = "Esan culture video resource";
    frame.loading = "lazy";
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;

    videoPanel.replaceChildren(frame);
  });
}
