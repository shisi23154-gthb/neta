(() => {
  const root = document.documentElement;
  const storageKey = "neta-theme";
  const toggle = document.querySelector("[data-theme-toggle]");
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  }

  const syncThemeButton = () => {
    if (!toggle) return;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    toggle.textContent = isDark ? "☀" : "☾";
    toggle.setAttribute("aria-pressed", String(isDark));
  };

  toggle?.addEventListener("click", () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = isDark ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
    syncThemeButton();
  });

  syncThemeButton();

  const input = document.querySelector("[data-filter-input]");
  const targets = [...document.querySelectorAll("[data-filter-target]")];

  const applyFilter = (value) => {
    const query = value.trim().toLowerCase();
    targets.forEach((target) => {
      const keywords = `${target.textContent} ${target.dataset.keywords || ""}`.toLowerCase();
      target.hidden = query.length > 0 && !keywords.includes(query);
    });
  };

  input?.addEventListener("input", (event) => {
    applyFilter(event.currentTarget.value);
  });

  document.querySelectorAll("[data-filter-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.dataset.filterChip || "";
      if (input) input.value = value;
      applyFilter(value);
    });
  });
})();
