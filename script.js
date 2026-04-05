document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".lesson-box, .lesson-link, .stat, .vocab-stat, .quick-links a");

  elements.forEach((el) => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("active");
        }, index * 40);
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach((el) => observer.observe(el));

  const searchInput = document.getElementById("vocabSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = Array.from(document.querySelectorAll(".vocab-category"));
  const noResults = document.getElementById("noResults");
  const totalCategoriesEl = document.getElementById("totalCategories");
  const visibleCategoriesEl = document.getElementById("visibleCategories");
  const visibleWordsEl = document.getElementById("visibleWords");

  if (!searchInput || !categoryFilter || categories.length === 0) {
    return;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function removeHighlights(el) {
    el.querySelectorAll(".highlight-hit").forEach((mark) => {
      const text = document.createTextNode(mark.textContent);
      mark.replaceWith(text);
    });
  }

  function highlightText(element, query) {
    if (!query) return;

    const regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");

    element.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        const text = node.textContent;
        if (regex.test(text)) {
          const span = document.createElement("span");
          span.innerHTML = text.replace(regex, '<span class="highlight-hit">$1</span>');
          node.replaceWith(span);
        }
      } else if (node.nodeType === 1 && !node.classList.contains("highlight-hit")) {
        highlightText(node, query);
      }
    });
  }

  function updateVocabulary() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    let visibleCategories = 0;
    let visibleWords = 0;

    categories.forEach((categoryBox) => {
      removeHighlights(categoryBox);

      const categoryName = categoryBox.dataset.category;
      const rows = Array.from(categoryBox.querySelectorAll(".vocab-table tr")).slice(1);
      let categoryVisibleRows = 0;

      rows.forEach((row) => {
        const rowText = row.innerText.toLowerCase();
        const matchQuery = query === "" || rowText.includes(query);
        row.style.display = matchQuery ? "" : "none";

        if (matchQuery) {
          categoryVisibleRows++;
          if (query) {
            Array.from(row.children).forEach((td) => highlightText(td, query));
          }
        }
      });

      const matchCategory = selectedCategory === "all" || categoryName === selectedCategory;
      const shouldShowCategory = matchCategory && categoryVisibleRows > 0;

      categoryBox.classList.toggle("hidden", !shouldShowCategory);

      const countEl = categoryBox.querySelector(".vocab-count");
      if (countEl) {
        countEl.textContent = "පෙනෙන වචන: " + categoryVisibleRows;
      }

      if (shouldShowCategory) {
        visibleCategories++;
        visibleWords += categoryVisibleRows;
      }
    });

    totalCategoriesEl.textContent = categories.length;
    visibleCategoriesEl.textContent = visibleCategories;
    visibleWordsEl.textContent = visibleWords;
    noResults.style.display = visibleWords === 0 ? "block" : "none";
  }

  searchInput.addEventListener("input", updateVocabulary);
  categoryFilter.addEventListener("change", updateVocabulary);

  updateVocabulary();
});