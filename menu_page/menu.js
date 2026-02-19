const carousel = document.getElementById("carousel");
const panels = [...carousel.querySelectorAll(".panel")];

let active = Number(carousel.dataset.active ?? 1);

let lastSwitch = 0;
const COOLDOWN = 250; // ms (원하면 350~500 추천)

function render(){
  const n = panels.length;

  panels.forEach(p => {
    p.classList.remove("is-left","is-center","is-right");
    p.style.transform = "";
  });

  const left  = (active - 1 + n) % n;
  const right = (active + 1) % n;

  panels[left].classList.add("is-left");
  panels[active].classList.add("is-center");
  panels[right].classList.add("is-right");
}

render();

panels.forEach(p => {
  p.addEventListener("pointerenter", () => {
    const now = Date.now();
    if (now - lastSwitch < COOLDOWN) return;

    const idx = Number(p.dataset.index);
    if (!Number.isNaN(idx) && idx !== active){
      active = idx;
      lastSwitch = now;
      render();
    }
  });
});
