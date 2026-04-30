const body = document.body;
const header = document.getElementById("site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? Array.from(siteNav.querySelectorAll("a")) : [];
const langButtons = Array.from(document.querySelectorAll("[data-set-lang]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const yearNodes = Array.from(document.querySelectorAll("[data-year]"));
const forms = Array.from(document.querySelectorAll("[data-mailto-form]"));
const LANGUAGE_KEY = "swt-language";

const languageMessages = {
  en: {
    opening: "Opening your email app...",
    success:
      "Your email app should open with the message prepared. If it does not, email ssadayap@gmail.com or call +91 74062 96649.",
    error:
      "We could not open your email app. Please email ssadayap@gmail.com or call +91 74062 96649.",
  },
  ta: {
    opening: "உங்கள் மின்னஞ்சல் செயலியைத் திறக்கிறோம்...",
    success:
      "தயார் செய்யப்பட்ட செய்தியுடன் உங்கள் மின்னஞ்சல் செயலி திறக்க வேண்டும். அது திறக்கவில்லை என்றால் ssadayap@gmail.com க்கு மின்னஞ்சல் அனுப்பவும் அல்லது +91 74062 96649 என்ற எண்ணுக்கு அழைக்கவும்.",
    error:
      "உங்கள் மின்னஞ்சல் செயலியைத் திறக்க முடியவில்லை. தயவுசெய்து ssadayap@gmail.com க்கு மின்னஞ்சல் அனுப்பவும் அல்லது +91 74062 96649 என்ற எண்ணுக்கு அழைக்கவும்.",
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

function getFieldLabel(field, language) {
  if (language === "ta" && field.dataset.labelTa) {
    return field.dataset.labelTa;
  }

  return field.dataset.labelEn || field.name || "";
}

function getFieldValue(field) {
  if (field.tagName === "SELECT") {
    const option = field.options[field.selectedIndex];
    return option ? option.text.trim() : "";
  }

  return field.value.trim();
}

function buildMailBody(form, language) {
  const intro =
    language === "ta" ? form.dataset.mailtoIntroTa || "" : form.dataset.mailtoIntroEn || "";
  const outro =
    language === "ta" ? form.dataset.mailtoOutroTa || "" : form.dataset.mailtoOutroEn || "";
  const lines = [];

  if (intro) {
    lines.push(intro, "");
  }

  const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter((field) => {
    if (!(field instanceof HTMLElement)) {
      return false;
    }

    if (!("name" in field) || !field.name || field.disabled) {
      return false;
    }

    const type = "type" in field ? field.type : "";
    if (type === "hidden" || type === "submit" || type === "button" || type === "reset") {
      return false;
    }

    if ((type === "checkbox" || type === "radio") && !field.checked) {
      return false;
    }

    return true;
  });

  fields.forEach((field) => {
    const value = getFieldValue(field);
    if (!value) {
      return;
    }

    lines.push(`${getFieldLabel(field, language)}: ${value}`);
  });

  if (outro) {
    lines.push("", outro);
  }

  return lines.join("\n");
}

function setupMailtoForms() {
  forms.forEach((form) => {
    const statusNode = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const language = getLanguage();
      const messages = languageMessages[language];
      const recipient = form.dataset.mailtoTo || "ssadayap@gmail.com";
      const subject =
        language === "ta"
          ? form.dataset.mailtoSubjectTa || form.dataset.mailtoSubjectEn || "Sadayappan Welfare Trust"
          : form.dataset.mailtoSubjectEn || "Sadayappan Welfare Trust";
      const bodyText = buildMailBody(form, language);
      const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyText)}`;

      if (statusNode) {
        statusNode.hidden = false;
        statusNode.dataset.state = "pending";
        statusNode.textContent = messages.opening;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        window.location.href = mailtoUrl;

        if (statusNode) {
          statusNode.hidden = false;
          statusNode.dataset.state = "success";
          statusNode.textContent = messages.success;
        }
      } catch {
        if (statusNode) {
          statusNode.hidden = false;
          statusNode.dataset.state = "error";
          statusNode.textContent = messages.error;
        }
      } finally {
        window.setTimeout(() => {
          if (submitButton) {
            submitButton.disabled = false;
          }
        }, 350);
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
setupMailtoForms();
syncHeaderState();

window.addEventListener("scroll", syncHeaderState, { passive: true });
