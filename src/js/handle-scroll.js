function isScrolledIntoView(element) {
  var rect = element.getBoundingClientRect();
  if (rect.bottom <= innerHeight) return 1;
  if (rect.top <= innerHeight) return 1;
}

function showElems() {
  for (let elem of canAnimateElems) {
    if (isScrolledIntoView(elem)) {
      const delay = elem.dataset.delay ? parseInt(elem.dataset.delay) : 0;
      setTimeout(() => {
        elem.classList.add("can-animate_shown");
        elem.classList.remove("can-animate_origin-top");
        elem.classList.remove("can-animate_origin-bottom");
        elem.classList.remove("can-animate_origin-left");
        elem.classList.remove("can-animate_origin-right");
        }, delay);
    }
  }
}

const canAnimateElems = document.querySelectorAll(".can-animate");

document.addEventListener("scroll", showElems);
document.addEventListener("DOMContentLoaded", showElems);