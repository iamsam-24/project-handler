import { brand, type HeroNavTarget } from "../content/brand";

const APPLIED = "data-project2-copy";

function setText(el: Element | null | undefined, text: string) {
  if (!el) return;
  el.textContent = text;
}

export function applyProjectCopy(
  frame: HTMLIFrameElement,
  onNavigate: (target: HeroNavTarget) => void,
) {
  const doc = frame.contentDocument;
  if (!doc?.body || doc.documentElement.getAttribute(APPLIED) === "1") {
    return;
  }

  doc.documentElement.setAttribute(APPLIED, "1");
  doc.title = `${brand.name} — workspace`;

  setText(doc.querySelector(".ghost"), brand.ghost);

  const dockItems = [...doc.querySelectorAll<HTMLAnchorElement>(".dock-item")];
  dockItems.forEach((item, index) => {
    if (item.classList.contains("dock-mark")) {
      item.setAttribute("aria-label", brand.homeAria);
      item.addEventListener("click", (event) => {
        event.preventDefault();
        onNavigate("home");
      });
      return;
    }

    const label = item.querySelector("span:not(.glyph)");
    const name = brand.dock[index - 1];
    if (label && name) setText(label, name);

    const target: HeroNavTarget =
      name === "Projects"
        ? "projects"
        : name === "Tasks"
          ? "tasks"
          : name === "Chat"
            ? "chat"
            : "home";

    item.addEventListener("click", (event) => {
      event.preventDefault();
      onNavigate(target);
    });
  });

  const headlineSpans = doc.querySelectorAll(".headline span i");
  if (headlineSpans[0]) setText(headlineSpans[0], brand.headline[0]);
  if (headlineSpans[1]) setText(headlineSpans[1], brand.headline[1]);

  setText(doc.querySelector(".lede"), brand.lede);

  const about = doc.querySelector(".card--about");
  setText(about?.querySelector(".label"), brand.aboutLabel);
  setText(about?.querySelector("h2"), brand.aboutTitle);

  const aboutKnob = doc.querySelector<HTMLButtonElement>(".knob--about");
  aboutKnob?.setAttribute("aria-label", brand.aboutAria);
  aboutKnob?.addEventListener("click", (event) => {
    event.preventDefault();
    onNavigate("workspace");
  });

  const note = doc.querySelector(".card--stove");
  setText(note?.querySelector(".label"), brand.noteLabel);
  setText(note?.querySelector("h2"), brand.noteTitle);
  const noteKnob = note?.querySelector<HTMLButtonElement>(".knob");
  noteKnob?.setAttribute("aria-label", brand.noteAria);
  noteKnob?.addEventListener("click", (event) => {
    event.preventDefault();
    onNavigate("workspace");
  });

  const stats = doc.querySelectorAll(".stat");
  if (stats[0]) {
    setText(stats[0].querySelector("dt"), brand.stats[0].label);
    setText(stats[0].querySelector("dd"), brand.stats[0].value);
  }
  if (stats[1]) {
    setText(stats[1].querySelector("dt"), brand.stats[1].label);
    setText(stats[1].querySelector("dd"), brand.stats[1].value);
  }

  const explore = doc.querySelector<HTMLButtonElement>(".liquid-button--explore");
  const exploreLabel = explore?.querySelector(".lbl");
  if (exploreLabel) setText(exploreLabel, brand.explore);
  explore?.addEventListener("click", (event) => {
    event.preventDefault();
    onNavigate("workspace");
  });

  const play = doc.querySelector<HTMLButtonElement>(".liquid-button--play");
  play?.setAttribute("aria-label", brand.playAria);
  play?.addEventListener("click", (event) => {
    event.preventDefault();
    onNavigate("workspace");
  });

  const scroll = doc.querySelector<HTMLAnchorElement>("a.scroll");
  if (scroll) {
    scroll.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = brand.scroll;
      }
    });
    scroll.addEventListener("click", (event) => {
      event.preventDefault();
      onNavigate("workspace");
    });
  }
}
