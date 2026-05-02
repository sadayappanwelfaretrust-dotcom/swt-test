const body = document.body;
const header = document.getElementById("site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? Array.from(siteNav.querySelectorAll("a")) : [];
const langButtons = Array.from(document.querySelectorAll("[data-set-lang]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const yearNodes = Array.from(document.querySelectorAll("[data-year]"));
const forms = Array.from(document.querySelectorAll("[data-formsubmit-form]"));
const LANGUAGE_KEY = "swt-language";

const languageMessages = {
  en: {
    opening: "Sending your enquiry securely...",
  },
  ta: {
    opening:
      "\u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0ba4\u0b95\u0bb5\u0bb2\u0bcd \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bbe\u0b95 \u0b85\u0ba9\u0bc1\u0baa\u0bcd\u0baa\u0baa\u0bcd\u0baa\u0b9f\u0bc1\u0b95\u0bbf\u0bb1\u0ba4\u0bc1...",
  },
};

function getLanguage() {
  return body.dataset.lang === "ta" ? "ta" : "en";
}

function setLanguage(language) {
  const nextLanguage = language === "ta" ? "ta" : "en";
  body.dataset.lang = nextLanguage;
  document.documentElement.lang = nextLanguage;

  langButtons.forEach((button) => {
    const isActive = button.dataset.setLang === nextLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try {
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

function syncHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeNav() {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function setupNavigation() {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
}

function setupRevealAnimations() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupManagedForms() {
  forms.forEach((form) => {
    const statusNode = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');
    const subjectNode = form.querySelector('input[name="_subject"]');
    const nextNode = form.querySelector('input[name="_next"]');
    const autoresponseNode = form.querySelector('input[name="_autoresponse"]');
    const sourceNode = form.querySelector('input[name="source_page"]');
    const languageNode = form.querySelector('input[name="submitted_language"]');
    const formTypeNode = form.querySelector('input[name="form_type"]');

    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      const language = getLanguage();
      const messages = languageMessages[language];

      if (subjectNode) {
        subjectNode.value =
          language === "ta"
            ? form.dataset.formSubjectTa || form.dataset.formSubjectEn || "Sadayappan Welfare Trust"
            : form.dataset.formSubjectEn || "Sadayappan Welfare Trust";
      }

      if (autoresponseNode) {
        autoresponseNode.value =
          language === "ta"
            ? form.dataset.autoresponseTa || form.dataset.autoresponseEn || ""
            : form.dataset.autoresponseEn || "";
      }

      if (nextNode) {
        nextNode.value = new URL("thanks.html", window.location.href).toString();
      }

      if (sourceNode) {
        sourceNode.value = window.location.href;
      }

      if (languageNode) {
        languageNode.value = language;
      }

      if (formTypeNode) {
        formTypeNode.value = form.dataset.formType || "";
      }

      if (statusNode) {
        statusNode.hidden = false;
        statusNode.dataset.state = "pending";
        statusNode.textContent = messages.opening;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-disabled", "true");
      }
    });
  });
}

function setupLanguageControls() {
  let savedLanguage = "en";

  try {
    savedLanguage = window.localStorage.getItem(LANGUAGE_KEY) || "en";
  } catch {
    savedLanguage = "en";
  }

  setLanguage(savedLanguage);

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.setLang || "en");
    });
  });
}

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

setupLanguageControls();
setupNavigation();
setupRevealAnimations();
setupManagedForms();
syncHeaderState();

window.addEventListener("scroll", syncHeaderState, { passive: true });
