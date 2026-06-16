// 금고 SVG 일러스트 (사진이 없을 때 표시)
function safeSVG() {
  return `<div class="safe-illustration"><svg width="62%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="28" width="140" height="144" rx="10" fill="#2b2b33" stroke="#3d3d47" stroke-width="2"/>
    <rect x="44" y="42" width="100" height="116" rx="6" fill="#202027" stroke="#3d3d47" stroke-width="2"/>
    <circle cx="94" cy="100" r="26" fill="#16161a" stroke="#c9a24b" stroke-width="3"/>
    <circle cx="94" cy="100" r="6" fill="#c9a24b"/>
    <line x1="94" y1="100" x2="94" y2="80" stroke="#c9a24b" stroke-width="3" stroke-linecap="round"/>
    <line x1="94" y1="100" x2="110" y2="108" stroke="#c9a24b" stroke-width="3" stroke-linecap="round"/>
    <rect x="150" y="92" width="8" height="26" rx="3" fill="#c9a24b"/>
  </svg></div>`;
}

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");

function media(p) {
  return p.img ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>` : safeSVG();
}

function render(cat = "all") {
  const list = cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  grid.innerHTML = list.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="card__media">${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}${media(p)}</div>
      <div class="card__body">
        <p class="card__spec">${p.catLabel}</p>
        <h3 class="card__name">${p.name}</h3>
        <div class="card__bottom">
          <p class="card__price">${p.price}원</p>
          <span class="card__more">자세히 →</span>
        </div>
      </div>
    </article>`).join("");
}

// 필터
filters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filters.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  render(btn.dataset.cat);
});

// 모달
const modal = document.getElementById("modal");
function openModal(p) {
  document.getElementById("modalMedia").innerHTML = media(p);
  document.getElementById("modalCat").textContent = p.catLabel;
  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalPrice").innerHTML = `${p.price}원 <small>본사 정품 · 부가세 포함</small>`;
  const specs = {
    "분류": p.catLabel,
    "잠금방식": p.lock,
    "공급": "범일금고 본사 직공급",
    "상세 스펙": "크기·내화등급 등은 상담 시 안내"
  };
  document.getElementById("modalSpecs").innerHTML =
    Object.entries(specs).map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join("");
  document.getElementById("modalInquiry").onclick = () => {
    closeModal();
    document.getElementById("formProduct").value = p.name;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  };
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); }

grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = PRODUCTS.find(x => x.id === card.dataset.id);
  if (p) openModal(p);
});
modal.addEventListener("click", e => { if (e.target.hasAttribute("data-close")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// 문의폼 → 메일 앱 (데모). 실제 운영 시 카카오톡 채널/접수 서비스로 교체 가능.
document.getElementById("inquiryForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const subject = `[금고 문의] ${f.product.value || "제품 문의"} - ${f.name.value}`;
  const body =
    `성함: ${f.name.value}\n연락처: ${f.phone.value}\n관심 제품: ${f.product.value}\n수량: ${f.qty.value}\n설치 지역: ${f.area.value}\n\n문의 내용:\n${f.memo.value}`;
  window.location.href = `mailto:uni4eber@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

render();
