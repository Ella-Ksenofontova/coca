function moveCarousel(current, selector) {
  const items = document.querySelectorAll(selector);
  const parent = items[0].parentElement;

  const delta = items[current].getBoundingClientRect().left - parent.getBoundingClientRect().left;
  parent.scrollBy({
    left: delta,
    behavior: "smooth"
  });
}