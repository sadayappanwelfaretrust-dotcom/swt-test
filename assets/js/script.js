const body = document.body;
const header = document.getElementById("site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? siteNav.querySelectorAll("a") : [];
const revealItems = document.querySelectorAll(".reveal");
const yearNodes = document.querySelectorAll("[data-year]");
const langButtons = document.querySelectorAll("[data-set-lang]");
const forms = document.querySelectorAll("[data-ajax-form]");
const LANGUAGE_KEY = "sadayappan-lang";

const languageMessages = {
  en: {
    sending: "Sending your details...",
    success:
      "Thank you. Your message has been sent. The trust can now follow up with you directly.",
    error:
      "Something went wrong while sending the form. Please try again or contact the trust by phone or email.",
  },
  ta: {
    sending: "உங்கள் தகவல்கள் அனுப்பப்படுகின்றன...",
    success:
      "நன்றி. உங்கள் தகவல் வெற்றிகரமாக அனுப்பப்பட்டது. அறக்கட்டளை உங்களை நேரடியாக தொடர்புகொள்ள முடியும்.",
    error:
      "படிவத்தை அனுப்பும் போது சிக்கல் ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது தொலைபேசி அல்லது மின்னஞ்சல் மூலம் தொடர்புகொள்ளவும்.",
  },
};

function getCurrentLanguage() {
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
    // Ignore localStorage failures in restricted environments.
  }
}

function syncHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 8);
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
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
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
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupForms() {
  forms.forEach((form) => {
    const statusNode = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');
    const ajaxEndpoint = form.dataset.ajaxEndpoint;
    const formUrlField = form.querySelector('input[name="_url"]');

    if (formUrlField && !formUrlField.value) {
      formUrlField.value = window.location.href;
    }

    form.addEventListener("submit", async (event) => {
      if (!ajaxEndpoint) {
        return;
      }

      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const currentLanguage = getCurrentLanguage();
      const messages = languageMessages[currentLanguage];
      const formData = new FormData(form);

      if (statusNode) {
        statusNode.hidden = false;
        statusNode.dataset.state = "pending";
        statusNode.textContent = messages.sending;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(ajaxEndpoint, {
          method: form.method || "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Form submission failed.");
        }

        form.reset();

        if (statusNode) {
          statusNode.hidden = false;
          statusNode.dataset.state = "success";
          statusNode.textContent = messages.success;
        }
      } catch (error) {
        if (statusNode) {
          statusNode.hidden = false;
          statusNode.dataset.state = "error";
          statusNode.textContent = messages.error;
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
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
  node.textContent = new Date().getFullYear();
});

setupLanguageControls();
setupNavigation();
setupRevealAnimations();
setupForms();
syncHeaderState();

window.addEventListener("scroll", syncHeaderState, { passive: true });
