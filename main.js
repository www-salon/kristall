(() => {
    "use strict";

    const header = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const languageControl = document.getElementById("language-control");
    const languageTrigger = document.getElementById("language-trigger");
    const languageMenu = document.getElementById("language-menu");
    const languageCurrent = document.getElementById("language-current");
    const languageOptions = [...languageMenu.querySelectorAll("[data-language]")];
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxClose = document.getElementById("lightbox-close");
    const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getTranslation = (language, key) => {
        return key.split(".").reduce((value, part) => value?.[part], translations[language]);
    };

    const applyLanguage = (language, { persist = true } = {}) => {
        const activeLanguage = translations[language] ? language : "de";
        const isArabic = activeLanguage === "ar";

        document.documentElement.lang = activeLanguage;
        document.documentElement.dir = isArabic ? "rtl" : "ltr";
        languageCurrent.textContent = activeLanguage.toUpperCase();
        languageOptions.forEach((option) => {
            option.setAttribute("aria-selected", String(option.dataset.language === activeLanguage));
        });

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const value = getTranslation(activeLanguage, element.dataset.i18n);
            if (typeof value === "string") {
                element.textContent = value;
            }
        });

        document.querySelectorAll("[data-i18n-content]").forEach((element) => {
            const value = getTranslation(activeLanguage, element.dataset.i18nContent);
            if (typeof value === "string") {
                element.setAttribute("content", value);
            }
        });

        document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
            const value = getTranslation(activeLanguage, element.dataset.i18nAlt);
            if (typeof value === "string") {
                element.alt = value;
            }
        });

        if (persist) {
            localStorage.setItem("kristall-language", activeLanguage);
        }
    };

    const closeMobileMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        mobileMenu.classList.remove("open");
        document.body.classList.remove("menu-open");
    };

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
    };

    const setupRevealAnimations = () => {
        const elements = document.querySelectorAll(".reveal");

        if (reducedMotion || !("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px"
            }
        );

        elements.forEach((element) => observer.observe(element));
    };

    const setupActiveNavigation = () => {
        const sections = ["story", "services", "gallery", "visit"]
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (!("IntersectionObserver" in window)) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                    });
                });
            },
            {
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => observer.observe(section));
    };

    const openLightbox = (source, alt) => {
        lightboxImage.src = source;
        lightboxImage.alt = alt || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        lightboxImage.src = "";
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        mobileMenu.setAttribute("aria-hidden", String(isOpen));
        mobileMenu.classList.toggle("open", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    const closeLanguageMenu = () => {
        languageControl.classList.remove("open");
        languageTrigger.setAttribute("aria-expanded", "false");
        languageMenu.hidden = true;
    };

    const openLanguageMenu = () => {
        languageControl.classList.add("open");
        languageTrigger.setAttribute("aria-expanded", "true");
        languageMenu.hidden = false;
    };

    languageTrigger.addEventListener("click", () => {
        const isOpen = languageTrigger.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            closeLanguageMenu();
        } else {
            openLanguageMenu();
        }
    });

    languageOptions.forEach((option) => {
        option.addEventListener("click", () => {
            applyLanguage(option.dataset.language);
            closeLanguageMenu();
            languageTrigger.focus();
        });
    });

    document.addEventListener("click", (event) => {
        if (!languageControl.contains(event.target)) {
            closeLanguageMenu();
        }
    });

    document.querySelectorAll("[data-gallery]").forEach((item) => {
        item.addEventListener("click", () => {
            const image = item.querySelector("img");
            openLightbox(item.dataset.gallery, image?.alt);
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLightbox();
            closeMobileMenu();
            closeLanguageMenu();
        }
    });

    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1080) {
            closeMobileMenu();
        }
    });

    const getLocaleRegion = () => {
        const locales = navigator.languages?.length ? navigator.languages : [navigator.language];

        for (const locale of locales) {
            if (!locale) {
                continue;
            }

            try {
                const region = new Intl.Locale(locale).region;
                if (region) {
                    return region.toUpperCase();
                }
            } catch {
                const match = locale.match(/[-_]([A-Za-z]{2})\b/);
                if (match) {
                    return match[1].toUpperCase();
                }
            }
        }

        return "";
    };

    const detectAutomaticLanguage = () => {
        const region = getLocaleRegion();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        const browserLanguages = (navigator.languages?.length ? navigator.languages : [navigator.language])
            .filter(Boolean)
            .map((locale) => locale.toLowerCase());

        const germanRegions = new Set(["DE", "AT", "CH", "LI", "LU", "BE"]);
        const middleEastRegions = new Set([
            "AE", "BH", "CY", "EG", "IL", "IQ", "IR", "JO", "KW", "LB",
            "OM", "PS", "QA", "SA", "SY", "TR", "YE"
        ]);
        const germanTimeZones = new Set([
            "Europe/Berlin",
            "Europe/Vienna",
            "Europe/Zurich",
            "Europe/Vaduz",
            "Europe/Luxembourg"
        ]);
        const middleEastTimeZones = new Set([
            "Africa/Cairo",
            "Asia/Aden",
            "Asia/Amman",
            "Asia/Baghdad",
            "Asia/Bahrain",
            "Asia/Beirut",
            "Asia/Damascus",
            "Asia/Dubai",
            "Asia/Gaza",
            "Asia/Hebron",
            "Asia/Jerusalem",
            "Asia/Kuwait",
            "Asia/Muscat",
            "Asia/Qatar",
            "Asia/Riyadh",
            "Asia/Tehran",
            "Europe/Istanbul"
        ]);

        if (middleEastRegions.has(region) || middleEastTimeZones.has(timeZone)) {
            return "ar";
        }

        if (germanRegions.has(region) || germanTimeZones.has(timeZone)) {
            return "de";
        }

        if (browserLanguages.some((locale) => locale.startsWith("ar"))) {
            return "ar";
        }

        if (browserLanguages.some((locale) => locale.startsWith("de"))) {
            return "de";
        }

        return "en";
    };

    const savedLanguage = localStorage.getItem("kristall-language");
    const initialLanguage = savedLanguage || detectAutomaticLanguage();

    applyLanguage(initialLanguage, { persist: Boolean(savedLanguage) });
    updateHeader();
    setupRevealAnimations();
    setupActiveNavigation();
})();
