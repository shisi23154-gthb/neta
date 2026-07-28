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

  const pickupItems = [
    {
      href: "archive/なへ公園/data01.gif.view.generated.html",
      src: "archive/なへ公園/data01.gif",
      label: "なへ公園",
      alt: "なへ公園",
      keywords: "archive image gif なへ公園 画像",
    },
    {
      href: "archive/なへ公園/大沢修.jpg.view.generated.html",
      src: "archive/なへ公園/大沢修.jpg",
      label: "大沢修",
      alt: "大沢修",
      keywords: "archive image 大沢修 画像",
    },
    {
      href: "archive/なへ公園/チョン！！.jpg.view.generated.html",
      src: "archive/なへ公園/チョン！！.jpg",
      label: "チョン！！",
      alt: "チョン！！",
      keywords: "archive image チョン 画像",
    },
    {
      href: "archive/なへ公園/チョン！！２.jpg.view.generated.html",
      src: "archive/なへ公園/チョン！！２.jpg",
      label: "チョン！！2",
      alt: "チョン！！２",
      keywords: "archive image チョン 画像",
    },
    {
      href: "archive/Home/激励/untitled1004001.jpg.view.generated.html",
      src: "archive/Home/激励/untitled1004001.jpg",
      label: "激励",
      alt: "激励",
      keywords: "archive image 激励 jpg 画像",
    },
    {
      href: "archive/なへ公園/Kj.jpg.view.generated.html",
      src: "archive/なへ公園/Kj.jpg",
      label: "Kj",
      alt: "Kj",
      keywords: "archive image Kj 画像",
    },
    {
      href: "archive/なへ公園/hamasaki_ayumi_13.jpg.view.generated.html",
      src: "archive/なへ公園/hamasaki_ayumi_13.jpg",
      label: "hamasaki",
      alt: "hamasaki_ayumi_13",
      keywords: "archive image hamasaki 画像",
    },
    {
      href: "archive/なへ公園/zz035.jpg.view.generated.html",
      src: "archive/なへ公園/zz035.jpg",
      label: "zz035",
      alt: "zz035",
      keywords: "archive image zz035 画像",
    },
    {
      href: "archive/なへ公園/最悪だよ.gif.view.generated.html",
      src: "archive/なへ公園/最悪だよ.gif",
      label: "最悪だよ",
      alt: "最悪だよ",
      keywords: "archive image gif 最悪 画像",
    },
    {
      href: "archive/なへ公園/ええやろ.gif.view.generated.html",
      src: "archive/なへ公園/ええやろ.gif",
      label: "ええやろ",
      alt: "ええやろ",
      keywords: "archive image gif ええやろ 画像",
    },
    {
      href: "archive/なへ公園/ラストシーン.gif.view.generated.html",
      src: "archive/なへ公園/ラストシーン.gif",
      label: "ラストシーン",
      alt: "ラストシーン",
      keywords: "archive image gif ラストシーン 画像",
    },
    {
      href: "archive/Home/激励/untitled1005001.gif.view.generated.html",
      src: "archive/Home/激励/untitled1005001.gif",
      label: "激励 gif",
      alt: "激励 gif",
      keywords: "archive image gif 激励 画像",
    },
  ];

  const shuffleItems = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };

  document.querySelectorAll("[data-pickup-gallery]").forEach((gallery) => {
    const count = Number(gallery.dataset.pickupCount) || gallery.children.length || 8;
    const basePath = gallery.dataset.pickupBase || "";
    const isArchiveGallery = gallery.classList.contains("archive-gallery-grid");
    const tileClass = isArchiveGallery ? "archive-gallery-tile" : "gallery-tile";
    const selectedItems = shuffleItems(pickupItems).slice(0, count);

    const buildUrl = (path) => new URL(`${basePath}${path}`, document.baseURI).href;
    const tiles = selectedItems.map((item, index) => {
      const link = document.createElement("a");
      link.className = `${tileClass}${index === 0 ? " large" : ""}`;
      link.href = buildUrl(item.href);
      link.dataset.randomItem = "";

      if (!isArchiveGallery) {
        link.dataset.filterTarget = "";
        link.dataset.keywords = item.keywords;
      }

      const image = document.createElement("img");
      image.src = buildUrl(item.src);
      image.alt = item.alt;

      const label = document.createElement("span");
      label.textContent = item.label;

      link.append(image, label);
      return link;
    });

    gallery.replaceChildren(...tiles);
  });

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

  const randomItems = [...document.querySelectorAll("[data-random-item]")];

  document.querySelectorAll("[data-random-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const visibleItems = randomItems.filter((item) => !item.hidden && item.href);
      const pool = visibleItems.length > 0 ? visibleItems : randomItems.filter((item) => item.href);
      const nextItem = pool[Math.floor(Math.random() * pool.length)];
      if (nextItem) {
        window.location.href = nextItem.href;
      }
    });
  });
})();
