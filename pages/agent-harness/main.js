const buttons = document.querySelectorAll(".mode-button");
const panels = document.querySelectorAll(".mode-card");
const revealItems = document.querySelectorAll(".reveal");

for (const button of buttons) {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;

    for (const item of buttons) {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    }

    for (const panel of panels) {
      panel.classList.toggle("is-active", panel.dataset.panel === mode);
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  },
  {
    threshold: 0.18,
  },
);

for (const item of revealItems) {
  observer.observe(item);
}
