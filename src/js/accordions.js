document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("section-faq__icon") || event.target.parentElement.classList.contains("accordion__visible-part")) {
    const hiddenPart = event.target.parentElement.parentElement.querySelector(".accordion__hidden-part");
    hiddenPart.classList.toggle("accordion__hidden-part_show");
    let icon;

    if (event.target.classList.contains("section-faq__icon")) {
      icon = event.target;
    } else {
      icon = event.target.parentElement.lastElementChild;
    }

    icon.classList.toggle("icon_image-plus");
    icon.classList.toggle("icon_image-minus");

    if (icon.getAttribute("aria-label") === "Open accordion") {
      icon.setAttribute("aria-label", "Close accordion");
    } else {
      icon.setAttribute("aria-label", "Open accordion");
    }
  }
})