import moveCarousel from "./move-carousel";
let articlesCurrent = 0;
let teamChoiceCurrent = 0;
let scrollEnabled = { "all-articles": true, "team-choice": true };

function moveNext(current, selector) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;
  const maxIndex = items.length - 1;
  const id = parent.parentElement.classList.contains("section-all-articles__carousel") ? "all-articles" : "team-choice";

  const maxIsScrolledIntoView = Math.round(items[maxIndex].getBoundingClientRect().left - parent.getBoundingClientRect().left) >= 0 && Math.round(parent.getBoundingClientRect().right - items[maxIndex].getBoundingClientRect().right) >= 0;

  if (current === maxIndex || maxIsScrolledIntoView) {
    const delta = parent.scrollWidth;
    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    parent.scrollBy({
      left: -delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-all-articles__carousel")) {
      articlesCurrent = 0;
    } else {
      teamChoiceCurrent = 0;
    }
  } else if (scrollEnabled[id]) {
    const padding = 16;
    const delta = (items[current + 1].scrollWidth + padding).toFixed(4);
    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    parent.scrollBy({
      left: delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-all-articles__carousel")) {
      articlesCurrent++;
    } else {
      teamChoiceCurrent++;
    }
  }
}

function movePrevious(current, selector) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;

  const id = parent.parentElement.classList.contains("section-all-articles__carousel") ? "all-articles" : "team-choice";

  if (current === 0 || Math.round(parent.scrollLeft + 7.5) < items[current - 1].scrollWidth && scrollEnabled[id]) {
    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    const delta = parent.scrollWidth;
    parent.scrollBy({
      left: delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-all-articles__carousel")) {
      articlesCurrent = items.length - 1;
    } else {
      teamChoiceCurrent = items.length - 1;
    }
  } else if (scrollEnabled[id]) {
    const padding = parent.parentElement.classList.contains("section-all-articles__carousel") ? 32 : 10
    const index = current > 0 ? current - 1 : 0

    const delta = (items[index].getBoundingClientRect().width + padding).toFixed(4);

    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    parent.scrollBy({
      left: -delta,
      behavior: behaviour
    });

    if (parent.parentElement.classList.contains("section-all-articles__carousel")) {
      articlesCurrent--;
    } else {
      teamChoiceCurrent--;
    }
  }
}

document.getElementById("articles-prev").addEventListener("click", () => {
  movePrevious(articlesCurrent, ".section-all-articles__card");
});

document.getElementById("articles-next").addEventListener("click", () => {
  moveNext(articlesCurrent, ".section-all-articles__card");
});

document.getElementById("team-choice-prev").addEventListener("click", () => {
  movePrevious(teamChoiceCurrent, ".section-our-team-choice__card");
});

document.getElementById("team-choice-next").addEventListener("click", () => {
  moveNext(teamChoiceCurrent, ".section-our-team-choice__card");
});

window.addEventListener("resize", () => {
  moveCarousel(teamChoiceCurrent, ".section-our-team-choice__card");
  moveCarousel(articlesCurrent, ".section-all-articles__card");
});

const carousels = document.querySelectorAll(".carousel__wrapper")
for (let carousel of carousels) {
  const id = carousel.parentElement.classList.contains("section-all-articles__carousel") ? "all-articles" : "team-choice";
  carousel.addEventListener("scrollend", () => {
    scrollEnabled[id] = true;
  })
}

function handleTouchEnd(event) {
  let parent = event.target.parentElement;
  while (parent && !parent.classList.contains("carousel__wrapper")) {
    parent = parent.parentElement;
  }

  if (parent) {
    const childElems = Array.from(parent.children);

    let finalIndex = 0;
    const selector = parent.parentElement.classList.contains("section-all-articles__carousel") ? ".section-all-articles__card" : ".section-our-team-choice__card";

    for (let elem of childElems) {
      const rect = elem.getBoundingClientRect();
      let visibleWidth = Math.min(parent.getBoundingClientRect().right - rect.left, rect.right - parent.getBoundingClientRect().left);
      const actualWidth = elem.offsetWidth;

      const firstCondition = visibleWidth * 2 >= Math.floor(actualWidth);
      const secondCondition = parent.getBoundingClientRect().left < rect.left || parent.getBoundingClientRect().right > rect.right;

      if (firstCondition && secondCondition) {
        const index = childElems.indexOf(elem);
        finalIndex = index;
      }
    }

    if (parent.parentElement.classList.contains("section-all-articles__carousel")) {
      articlesCurrent = finalIndex;
    } else {
      teamChoiceCurrent = finalIndex;
    }

    moveCarousel(finalIndex, selector);
  }
}

document.body.addEventListener('touchend', handleTouchEnd);