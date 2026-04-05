document.addEventListener("DOMContentLoaded", function () {
  let revealObserver = null;

  function setupRevealObserver() {
    revealObserver = new IntersectionObserver((entries) => {
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
  }

  function revealElements(elements) {
    if (!revealObserver || !elements || elements.length === 0) {
      return;
    }

    elements.forEach((el) => {
      if (!el) return;
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  setupRevealObserver();

  const initialRevealElements = document.querySelectorAll(".lesson-box, .lesson-link, .stat, .quick-links a");
  revealElements(initialRevealElements);

  const vocabularyContainer = document.getElementById("vocabularyContainer");
  const searchInput = document.getElementById("vocabSearch");
  const noResults = document.getElementById("noResults");

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
    if (!query || !element) return;

    const regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");

    Array.from(element.childNodes).forEach((node) => {
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

  function groupVocabularyBySection(vocabulary) {
    const sections = [];

    vocabulary.forEach((item) => {
      const sectionId = item.sectionId || "";
      const sectionTitle = item.section || "";
      const category = item.category || "";

      let existingSection = sections.find((section) => section.sectionId === sectionId);

      if (!existingSection) {
        existingSection = {
          sectionId,
          section: sectionTitle,
          category,
          words: []
        };
        sections.push(existingSection);
      }

      existingSection.words.push(item);
    });

    return sections;
  }

  function createVocabularySection(sectionData) {
    const sectionBox = document.createElement("div");
    sectionBox.className = "lesson-box vocab-category";
    sectionBox.id = sectionData.sectionId;
    sectionBox.setAttribute("data-category", sectionData.category || "");

    const title = document.createElement("h2");
    title.textContent = sectionData.section || "";

    const count = document.createElement("span");
    count.className = "vocab-count";
    count.textContent = "පෙනෙන වචන: " + sectionData.words.length;

    const table = document.createElement("table");
    table.className = "table vocab-table";

    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
      <th>ජපන් වචනය</th>
      <th>රෝමාජි</th>
      <th>සිංහල අර්ථය</th>
    `;
    table.appendChild(headerRow);

    sectionData.words.forEach((word) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${word.japanese || ""}</td>
        <td>${word.romaji || ""}</td>
        <td>${word.meaning || ""}</td>
      `;
      table.appendChild(row);
    });

    sectionBox.appendChild(title);
    sectionBox.appendChild(count);
    sectionBox.appendChild(table);

    return sectionBox;
  }

  function renderDynamicVocabulary() {
    if (!vocabularyContainer) {
      return;
    }

    if (!Array.isArray(window.vocabulary) || window.vocabulary.length === 0) {
      vocabularyContainer.innerHTML = `
        <div class="lesson-box">
          <h2>Vocabulary data not found</h2>
          <p class="muted">vocab-data.js file එක load වුණේ නැහැ හෝ වචන data හිස්ය.</p>
        </div>
      `;
      revealElements(vocabularyContainer.querySelectorAll(".lesson-box"));
      return;
    }

    const validVocabulary = window.vocabulary.filter((item) => {
      return item && item.japanese && item.romaji && item.meaning;
    });

    const sections = groupVocabularyBySection(validVocabulary);
    const fragment = document.createDocumentFragment();

    sections.forEach((section) => {
      fragment.appendChild(createVocabularySection(section));
    });

    vocabularyContainer.innerHTML = "";
    vocabularyContainer.appendChild(fragment);

    const dynamicRevealElements = vocabularyContainer.querySelectorAll(".lesson-box");
    revealElements(dynamicRevealElements);
  }

  function updateVocabulary() {
    const categories = Array.from(document.querySelectorAll(".vocab-category"));

    if (!searchInput || categories.length === 0 || !noResults) {
      return;
    }

    const query = searchInput.value.trim().toLowerCase();
    let visibleWords = 0;

    categories.forEach((categoryBox) => {
      removeHighlights(categoryBox);

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

      const shouldShowCategory = categoryVisibleRows > 0;
      categoryBox.classList.toggle("hidden", !shouldShowCategory);

      const countEl = categoryBox.querySelector(".vocab-count");
      if (countEl) {
        countEl.textContent = "පෙනෙන වචන: " + categoryVisibleRows;
      }

      if (shouldShowCategory) {
        visibleWords += categoryVisibleRows;
      }
    });

    noResults.style.display = visibleWords === 0 ? "block" : "none";
  }

  renderDynamicVocabulary();

  if (searchInput && noResults) {
    searchInput.addEventListener("input", updateVocabulary);
    updateVocabulary();
  }
});