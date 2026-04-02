const reveals = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll('.site-nav a');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
const sections = document.querySelectorAll('main[id], section[id]');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const mobileSidebar = document.querySelector('.mobile-sidebar');
const navOverlay = document.querySelector('.nav-overlay');

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
    threshold: 0.18,
  }
);

reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 90, 420)}ms`;
  observer.observe(item);
});

const setActiveNav = (id) => {
  [navLinks, mobileNavLinks].forEach((linkGroup) => {
    linkGroup.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry?.target?.id) {
      setActiveNav(visibleEntry.target.id);
    }
  },
  {
    threshold: [0.35, 0.6],
    rootMargin: '-20% 0px -45% 0px',
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

const toggleMobileMenu = (shouldOpen) => {
  if (!mobileSidebar || !menuToggle || !navOverlay) {
    return;
  }

  mobileSidebar.classList.toggle('is-open', shouldOpen);
  navOverlay.hidden = !shouldOpen;
  menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  document.body.classList.toggle('nav-open', shouldOpen);
};

if (menuToggle && menuClose && navOverlay) {
  menuToggle.addEventListener('click', () => {
    toggleMobileMenu(true);
  });

  menuClose.addEventListener('click', () => {
    toggleMobileMenu(false);
  });

  navOverlay.addEventListener('click', () => {
    toggleMobileMenu(false);
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });
}

setActiveNav('top');
