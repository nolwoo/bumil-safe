// ===== 네이버 스토어형 제품 목록 =====
const CAT_LABEL = { all: "전체상품", best: "베스트", smart: "디자인금고", finger: "지문인식금고", basic: "가정·사무용금고" };
let state = { cat: "all", sort: "popular" };

const num = (s) => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;

function getList() {
  let list = PRODUCTS.filter((p) => {
    if (state.cat === "all") return true;
    if (state.cat === "best") return p.best;
    return p.cat === state.cat;
  });
  const s = state.sort;
  list = [...list];
  if (s === "popular") list.sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);
  else if (s === "low") list.sort((a, b) => num(a.price) - num(b.price));
  else if (s === "high") list.sort((a, b) => num(b.price) - num(a.price));
  else if (s === "discount") list.sort((a, b) => b.discount - a.discount);
  else if (s === "review") list.sort((a, b) => b.reviews - a.reviews);
  else if (s === "rating") list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  // new = 기본 등록 순서 유지
  return list;
}

function ratingHTML(p) {
  if (!p.reviews) return "";
  return `<span class="pcard__rating"><span class="star">★</span> ${p.rating} <span class="rv">리뷰 ${p.reviews.toLocaleString()}</span></span>`;
}

function cardHTML(p) {
  return `
    <article class="pcard" data-id="${p.id}">
      <div class="pcard__media">
        ${p.best ? `<span class="pcard__best">BEST</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <span class="pcard__heart">♡</span>
      </div>
      <div class="pcard__body">
        <p class="pcard__name">${p.name}</p>
        <p class="pcard__desc">${p.catLabel} · ${p.lock} · 본사 정품</p>
        <div class="pcard__price">
          ${p.original ? `<span class="pcard__original">${p.original}원</span>` : ""}
          <span class="pcard__sale">
            ${p.discount ? `<span class="pcard__discount">${p.discount}%</span>` : ""}
            <span class="pcard__now">${p.price}<small>원</small></span>
          </span>
        </div>
        <div class="pcard__meta">
          <span class="pcard__ship">무료배송</span>
          ${ratingHTML(p)}
        </div>
      </div>
    </article>`;
}

const plist = document.getElementById("plist");
function render() {
  const list = getList();
  plist.innerHTML = list.map(cardHTML).join("");
  document.getElementById("count").textContent = list.length;
  document.getElementById("listTitle").textContent = CAT_LABEL[state.cat];
  document.getElementById("crumbCat").textContent = CAT_LABEL[state.cat];
}

// 카테고리 탭
document.querySelectorAll(".cattab[data-cat]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".cattab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    state.cat = tab.dataset.cat;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// 정렬
document.querySelectorAll(".sort[data-sort]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sort").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.sort = btn.dataset.sort;
    render();
  });
});

// ===== 상세 모달 =====
const modal = document.getElementById("modal");
function openModal(p) {
  document.getElementById("modalMedia").innerHTML = `<img src="${p.img}" alt="${p.name}" />`;
  document.getElementById("modalBest").innerHTML = p.best ? `<span class="modal__best">BEST</span>` : "";
  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalPrice").innerHTML =
    `${p.original ? `<span class="o">${p.original}원</span>` : ""}` +
    `${p.discount ? `<span class="d">${p.discount}%</span>` : ""}` +
    `<span class="n">${p.price}원</span>`;
  document.getElementById("modalRating").innerHTML = p.reviews
    ? `<span class="star">★</span> ${p.rating} · 리뷰 ${p.reviews.toLocaleString()}개 · 무료배송`
    : "무료배송 · 본사 정품";
  const specs = { "분류": p.catLabel, "잠금방식": p.lock, "공급": "범일금고 본사 직공급", "상세 스펙": "크기·내화등급 등은 상담 시 안내" };
  document.getElementById("modalSpecs").innerHTML =
    Object.entries(specs).map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join("");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); }

plist.addEventListener("click", (e) => {
  const card = e.target.closest(".pcard");
  if (!card) return;
  const p = PRODUCTS.find((x) => x.id === card.dataset.id);
  if (p) openModal(p);
});
modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

render();
