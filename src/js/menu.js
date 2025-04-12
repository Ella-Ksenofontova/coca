document.getElementById("open-menu").addEventListener("click", () => {
  document.querySelector(".backdrop").classList.add("backdrop_show");
  document.querySelector(".offcanvas").classList.add("offcanvas_show");
});

document.getElementById("close-menu").addEventListener("click", () => {
  document.querySelector(".backdrop").classList.remove("backdrop_show");
  document.querySelector(".offcanvas").classList.remove("offcanvas_show");
});