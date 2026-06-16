// 카카오톡 상담 버튼 연결 (config.js의 SITE.KAKAO_URL 사용)
// HTML에서 data-kakao 속성이 붙은 <a>는 모두 자동으로 연결됩니다.
(function () {
  const url = (typeof SITE !== "undefined" && SITE.KAKAO_URL) ? SITE.KAKAO_URL.trim() : "";
  document.querySelectorAll("[data-kakao]").forEach((el) => {
    if (url) {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.setAttribute("href", "#");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        alert("카카오톡 상담 채널을 준비 중입니다.\n지금은 전화(02-2632-6070)로 문의해 주세요.");
      });
    }
  });
})();
