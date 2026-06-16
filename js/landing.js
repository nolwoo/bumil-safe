// ── 상단 배너 닫기 (하루 동안 유지) ──
const topbar = document.getElementById("topbar");
const KEY = "bumil_topbar_closed";
if (localStorage.getItem(KEY) && Date.now() - +localStorage.getItem(KEY) < 86400000) {
  topbar.classList.add("is-hidden");
}
document.getElementById("topbarClose").addEventListener("click", () => {
  topbar.classList.add("is-hidden");
  localStorage.setItem(KEY, Date.now());
});

// ── 사진 마퀴 (실제 제품 사진으로 채움) ──
const PHOTOS = [
  "https://shop-phinf.pstatic.net/20240703_55/1719994973530TrLpu_JPEG/3823964399535633_1711775406.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20251230_117/1767063422738li6Uf_JPEG/101196359426119063_125666208.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20250114_86/1736839451006dHcKo_JPEG/70972381158181458_1736239241.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20240220_145/1708406722769Wr34m_JPEG/109542621470677133_223545229.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20231030_76/1698640004818F2z4J_JPEG/7064053042745665_2585868.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20260209_167/177060360090921yLi_JPEG/104736393001590645_1331413374.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20250929_263/1759114811360aAvoo_JPEG/68935905174000461_1978914716.jpg?type=f750_750",
  "https://shop-phinf.pstatic.net/20260321_221/1774055817188RkPbH_JPEG/120774170433449025_1580024009.jpg?type=f750_750"
];
const track = document.getElementById("marqueeTrack");
const item = url => `<div class="marquee__item"><img src="${url}" alt="범일금고 제품" loading="lazy" /></div>`;
// 끊김 없는 루프를 위해 두 번 반복
track.innerHTML = [...PHOTOS, ...PHOTOS].map(item).join("");

// ── 인기 제품 8개 미리보기 (products.js의 PRODUCTS 재사용) ──
const FEATURED = ["oarcfx", "stl85fx", "tof105", "tof106a", "ze106a", "ze50", "modu70fo", "natu50fx"];
const fgrid = document.getElementById("featuredGrid");
if (fgrid && typeof PRODUCTS !== "undefined") {
  const pick = FEATURED.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  fgrid.innerHTML = pick.map(p => `
    <a class="pcard reveal" href="products.html">
      <div class="pcard__media"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="pcard__body">
        <p class="pcard__cat">${p.catLabel}</p>
        <p class="pcard__name">${p.name}</p>
        <p class="pcard__price">${p.price}원</p>
      </div>
    </a>`).join("");
}

// ── 스크롤 등장 애니메이션 ──
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
