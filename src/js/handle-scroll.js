function isScrolledIntoView(element) {
  var rect = element.getBoundingClientRect();
  if (rect.bottom <= innerHeight) return 1;
  if (rect.top <= innerHeight) return 1;
}

function showElems() {
  for (let elem of canAnimateElems) {
    if (isScrolledIntoView(elem)) {
      const delay = elem.dataset.delay ? parseInt(elem.dataset.delay) : 0;
      setTimeout(() => elem.classList.add("can-animate_shown"), delay);
    }
  }
}

const canAnimateElems = document.querySelectorAll(".can-animate");

document.addEventListener("scroll", showElems);
document.addEventListener("DOMContentLoaded", showElems);