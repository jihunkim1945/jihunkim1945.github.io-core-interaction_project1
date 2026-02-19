function fill(el, html){
  const chunk = document.createElement("div");
  chunk.innerHTML = `<span>${html}</span>`.repeat(18);
  const chunk2 = chunk.cloneNode(true);
  const wrap = document.createElement("div");
  wrap.appendChild(chunk);
  wrap.appendChild(chunk2);
  el.innerHTML = "";
  el.appendChild(wrap);
}

fill(
  document.getElementById("marqueeTop"),
  "wake up • wake up • lucid • don't open the door • "
);
fill(
  document.getElementById("marqueeBottom"),
  "fall asleep • fall asleep • look for the television • "
);

// title ghosts (subtle)
const titleEl = document.getElementById("title");
const titleText = titleEl.textContent;

function spawnTitleGhost(){
  const g = document.createElement("div");
  g.className = "titleGhost";
  g.textContent = titleText;

  const x = (Math.random() * 90 - 45).toFixed(1) + "px";
  const y = (Math.random() * 26 - 13).toFixed(1) + "px";
  const dur = (650 + Math.random() * 450).toFixed(0) + "ms";

  g.style.setProperty("--x", x);
  g.style.setProperty("--y", y);
  g.style.setProperty("--dur", dur);

  titleEl.appendChild(g);
  setTimeout(() => g.remove(), parseInt(dur, 10) + 80);
}

setInterval(spawnTitleGhost, 150);
for (let i=0; i<6; i++) setTimeout(spawnTitleGhost, i * 80);


const tv = document.getElementById("tv");
const frame = document.querySelector(".frame");
const bg = document.querySelector(".bg");

// 다음 페이지 파일명 원하는 걸로 바꿔


function setOrigin(){
  const fr = frame.getBoundingClientRect();
  const tr = tv.getBoundingClientRect();

  const cx = (tr.left + tr.width/2) - fr.left;
  const cy = (tr.top + tr.height/2) - fr.top;

  const px = Math.max(0, Math.min(1, cx / fr.width));
  const py = Math.max(0, Math.min(1, cy / fr.height));

  const sx = (px * 100).toFixed(2) + "%";
  const sy = (py * 100).toFixed(2) + "%";

  // frame 변수(링/프레임용)
  frame.style.setProperty("--sx", sx);
  frame.style.setProperty("--sy", sy);

  // bg도 같은 값 쓰게(배경용)
  bg.style.setProperty("--sx", sx);
  bg.style.setProperty("--sy", sy);
}

tv.addEventListener("mouseenter", () => {
  setOrigin();
  document.body.classList.add("isSucking");
});

tv.addEventListener("mouseleave", () => {
  document.body.classList.remove("isSucking");
});

window.addEventListener("resize", () => {
  if (document.body.classList.contains("isSucking")) setOrigin();
});

tv.addEventListener("click", () => {
  setOrigin();
  document.body.classList.add("isEntering");
  frame.classList.add("isEntering");

  setTimeout(() => {
    window.location.href = NEXT_PAGE;
  }, 420);
});


tv.addEventListener("click", () => {
  window.location.href = "../menu_page/menu.html";
});

(() => {
  const audio = document.getElementById("bgmHome");
  if (!audio) return;

  audio.volume = 0.35; // 원하는 볼륨으로 조절 (0~1)

  const start = async () => {
    try {
      await audio.play();
    } catch (e) {
      // autoplay 막혔을 때도, 다음 입력에서 다시 시도하게 둠
    }
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
  };

  // ✅ 유저 첫 입력에서만 재생
  window.addEventListener("pointerdown", start, { once: true });
  window.addEventListener("keydown", start, { once: true });
})();
