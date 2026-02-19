// ===== INTRO START =====
const intro = document.getElementById("intro");
const startA = document.getElementById("startA");
const startB = document.getElementById("startB");
const scroller = document.getElementById("scroller");

function startStory() {
  if (!intro || !scroller) return;

  intro.style.display = "none";
  document.body.style.overflow = "hidden";
  scroller.style.overflowY = "auto";

  goToScene(1);
  showChoicesDelayed(1);   // ⭐ 선택지 딜레이
}

startA?.addEventListener("click", startStory);
startB?.addEventListener("click", startStory);

// ===== 선택지 3초 딜레이 =====
function showChoicesDelayed(sceneNum){
  const scene = document.getElementById(`scene${sceneNum}`);
  const bar = scene?.querySelector("[data-choice]");
  if(!bar) return;

  bar.style.opacity = "0";
  bar.style.pointerEvents = "none";

  setTimeout(()=>{
    bar.style.opacity = "1";
    bar.style.pointerEvents = "auto";
  }, 3000);
}

// ===== images per scene =====
const sceneImages = {
  1: ["../assets/images/s1.jpeg", "../assets/images/s1-1.jpeg"],
  2: ["../assets/images/s2.jpeg", "../assets/images/s2-1.jpeg", "../assets/images/s2-2.jpeg"],
  3: ["../assets/images/s3.jpeg", "../assets/images/s3-1.jpeg"],
  4: ["../assets/images/s4.jpeg", "../assets/images/s4-1.jpeg", "../assets/images/s4-2.jpeg"],
};

function pickRandom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

for(let n=1; n<=4; n++){
  const img = document.getElementById(`scene${n}Bg`);
  if(img && sceneImages[n]) img.src = pickRandom(sceneImages[n]);
}

// ===== reveal setup =====
function setupReveal(sceneNum, opts={}){
  const svg = document.getElementById(`reveal${sceneNum}`);
  const mask = document.getElementById(`mask${sceneNum}`);
  if(!svg || !mask) return;

  const VBW = 1000, VBH = 1000;
  const blockSize = opts.blockSize ?? 150;
  const count = opts.count ?? 10;
  const jitterX = opts.jitterX ?? 160;
  const jitterY = opts.jitterY ?? 120;

  while(mask.childNodes.length > 1) mask.removeChild(mask.lastChild);

  const rects = [];
  for(let i=0;i<count;i++){
    const r = document.createElementNS("http://www.w3.org/2000/svg","rect");
    r.setAttribute("width", blockSize);
    r.setAttribute("height", blockSize);
    r.setAttribute("fill", "white");
    r.setAttribute("x", -999);
    r.setAttribute("y", -999);
    mask.appendChild(r);
    rects.push(r);
  }

  function toViewBox(e){
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * VBW,
      y: ((e.clientY - rect.top) / rect.height) * VBH
    };
  }

  svg.addEventListener("mousemove", (e) => {
    const { x, y } = toViewBox(e);
    rects.forEach(r => {
      const rx = x + (Math.random()*jitterX - jitterX/2) - blockSize/2;
      const ry = y + (Math.random()*jitterY - jitterY/2) - blockSize/2;
      r.setAttribute("x", rx);
      r.setAttribute("y", ry);
    });
  });

  svg.addEventListener("mouseleave", () => {
    rects.forEach(r => {
      r.setAttribute("x", -999);
      r.setAttribute("y", -999);
    });
  });
}

setupReveal(1, { blockSize: 210, count: 10, jitterX: 180, jitterY: 140 });
setupReveal(2, { blockSize: 190, count: 10, jitterX: 170, jitterY: 130 });
setupReveal(3, { blockSize: 185, count: 10, jitterX: 165, jitterY: 125 });
setupReveal(4, { blockSize: 200, count: 10, jitterX: 175, jitterY: 135 });

// ===== SNAP + HOLD =====
const scenes = [...document.querySelectorAll(".scene")];
let unlockedUpTo = 1;
let current = 1;

function goToScene(n){
  current = n;
  document.getElementById(`scene${n}`)?.scrollIntoView({ behavior:"smooth", block:"start" });
}

// ===== choice click =====
scenes.forEach(scene => {
  const n = Number(scene.dataset.scene);
  const bar = scene.querySelector("[data-choice]");
  if(!bar) return;

  bar.querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {

      // ⭐ 마지막 씬 → intro 복귀
      if(n === 4){
        setTimeout(()=>{
          intro.style.display = "flex";
          scroller.scrollTo({ top:0, behavior:"auto" });
          unlockedUpTo = 1;
        }, 400);
        return;
      }

      // 일반 씬
      scene.classList.remove("isLocked");
      unlockedUpTo = Math.max(unlockedUpTo, n + 1);
      goToScene(n + 1);
      showChoicesDelayed(n+1);
    });
  });
});

// ===== lock scroll =====
function enforceLock(){
  const top = scroller.scrollTop;
  let closest = 1;
  let dist = Infinity;

  scenes.forEach(s => {
    const d = Math.abs(top - s.offsetTop);
    if(d < dist){
      dist = d;
      closest = Number(s.dataset.scene);
    }
  });

  if(closest > unlockedUpTo){
    goToScene(unlockedUpTo);
    return;
  }
  current = closest;
}

scroller.addEventListener("scroll", () => requestAnimationFrame(enforceLock));

function blockScrollWhenLocked(e){
  const scene = document.getElementById(`scene${current}`);
  if(scene?.classList.contains("isLocked")){
    e.preventDefault();
  }
}

scroller.addEventListener("wheel", blockScrollWhenLocked, { passive:false });
scroller.addEventListener("touchmove", blockScrollWhenLocked, { passive:false });

// 시작 위치
goToScene(1);
(() => {
  const audio = document.getElementById("bgm");
  if (!audio) return;

  audio.volume = 0.35;

  const start = async () => {
    try { await audio.play(); } catch (e) {}
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
  };

  window.addEventListener("pointerdown", start, { once: true });
  window.addEventListener("keydown", start, { once: true });
})();
