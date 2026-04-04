document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".lesson-box, .lesson-link, .stat");

  elements.forEach((el) => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach((el) => observer.observe(el));
});