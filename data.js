// ─────────────────────────────────────────────
// Resume Data Loader (Google Sheets CSV → HTML)
// Works for any tab, no API key required
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("resume")) return;
  loadResumeData();
});

function loadResumeData() {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT34zmjRCBpY8IhwP2SLZdmARVq3_vsEUMiKcnl_-nRpYSyTLVjr1vZYyNhrJXUwtYY3SEVPDqj17d9/pub?gid=1616761404&single=true&output=csv";

  fetch(csvUrl)
    .then(res => res.text())
    .then(csv => {
      const rows = parseCSV(csv);
      if (!rows || rows.length < 2) return;

      // Remove placeholder entries
      document.querySelectorAll(".resume-section .entry, .proj-entry, .lead-entry, .skill-item")
        .forEach(el => el.remove());

      rows.slice(1).forEach(row => {
        const [section, variable, title, subtitle, descA, descB, tags] = row;
        const sectionId = mapSection(section);
        if (!sectionId) return;

        const container = document.querySelector(`#${sectionId}`);
        if (!container) return;

        if (section === "Summary") {
          const p = container.querySelector(".summary-text");
          p.textContent = descA || title;
          return;
        }

        if (section === "Experience" || section === "Education") {
          const div = document.createElement("div");
          div.className = "entry";
          div.innerHTML = `
            <div class="entry-title">${title}</div>
            <div class="entry-date">${subtitle || ""}</div>
            <div class="entry-org">${descA || ""}</div>
            <ul class="entry-bullets">
              ${descB ? `<li>${descB}</li>` : ""}
            </ul>
          `;
          container.appendChild(div);
          return;
        }

        if (section === "Projects") {
          const div = document.createElement("div");
          div.className = "proj-entry";
          div.innerHTML = `
            <div class="proj-entry-header">
              <span class="proj-entry-name">${title}</span>
              <span class="proj-entry-stack">${subtitle || ""}</span>
            </div>
            <div class="proj-entry-desc">${descA || ""}</div>
          `;
          container.appendChild(div);
          return;
        }

        if (section === "Leadership") {
          const div = document.createElement("div");
          div.className = "lead-entry";
          div.innerHTML = `
            <div class="lead-title">${title}</div>
            <div class="lead-date">${subtitle || ""}</div>
            <div class="lead-org">${descA || ""}</div>
            <div class="lead-desc">${descB || ""}</div>
          `;
          container.appendChild(div);
          return;
        }

        if (section === "Skills") {
          const div = document.createElement("div");
          div.className = "skill-item";
          div.textContent = title;
          container.appendChild(div);
          return;
        }
      });
    })
    .catch(err => console.error("Resume load error:", err));
}

// Simple CSV parser
function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map(line => line.split(",").map(cell => cell.trim()));
}

// Map sheet section → HTML section ID
function mapSection(sectionName) {
  return {
    "Summary": "sec-summary",
    "Experience": "sec-experience",
    "Education": "sec-education",
    "Projects": "sec-projects",
    "Leadership": "sec-leadership",
    "Skills": "sec-skills"
  }[sectionName];
}
