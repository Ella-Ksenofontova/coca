let aboutCurrent = 0;
let teamCurrent = 0;
let scrollEnabled = { "about": true, "team": true };

function moveNext(current, selector) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;
  const maxIndex = items.length - 1;
  const id = parent.parentElement.classList.contains("section-about__carousel") ? "about" : "team";

  const maxIsScrolledIntoView = items[maxIndex].getBoundingClientRect().left - parent.getBoundingClientRect().left > 0 && parent.getBoundingClientRect().right - items[maxIndex].getBoundingClientRect().right > 0;

  if (current === maxIndex || maxIsScrolledIntoView) {
    const delta = parent.scrollWidth;
    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    parent.scrollBy({
      left: -delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-about__carousel")) {
      aboutCurrent = 0;
    } else {
      teamCurrent = 0;
    }
  } else if (scrollEnabled[id]) {
    const padding = parent.parentElement.classList.contains("section-about__carousel") ? 32 : 10;
    const delta = (items[current + 1].scrollWidth + padding).toFixed(4);
    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    parent.scrollBy({
      left: delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-about__carousel")) {
      aboutCurrent++;
    } else {
      teamCurrent++;
    }
  }
}

function movePrevious(current, selector) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;

  const id = parent.parentElement.classList.contains("section-about__carousel") ? "about" : "team";

  if (current === 0 || Math.round(parent.scrollLeft + 7.5) < items[current - 1].scrollWidth && scrollEnabled[id]) {
    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    const delta = parent.scrollWidth;
    parent.scrollBy({
      left: delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-about__carousel")) {
      aboutCurrent = items.length - 1;
    } else {
      teamCurrent = items.length - 1;
    }
  } else if (scrollEnabled[id]) {
    const padding = parent.parentElement.classList.contains("section-about__carousel") ? 32 : 10
    const index = current > 0 ? current - 1 : 0

    const delta = (items[index].getBoundingClientRect().width + padding).toFixed(4);

    scrollEnabled[id] = !(parent.offsetWidth < items.reduce((prev, current) => current + prev, 0));
    parent.scrollBy({
      left: -delta,
      behavior: behaviour
    });

    if (parent.parentElement.classList.contains("section-about__carousel")) {
      aboutCurrent--;
    } else {
      teamCurrent--;
    }
  }
}

document.getElementById("about-prev").addEventListener("click", () => {
  movePrevious(aboutCurrent, ".section-about__carousel .section-about__card, .section-about__carousel-image");
});

document.getElementById("about-next").addEventListener("click", () => {
  moveNext(aboutCurrent, ".section-about__carousel .section-about__card, .section-about__carousel-image");
});

document.getElementById("team-prev").addEventListener("click", () => {
  movePrevious(teamCurrent, ".section-team__card");
});

document.getElementById("team-next").addEventListener("click", () => {
  moveNext(teamCurrent, ".section-team__card");
});

window.addEventListener("resize", () => {
  moveCarousel(teamCurrent, ".section-team__card");
  moveCarousel(aboutCurrent, ".section-about__carousel .section-about__card, .section-about__carousel-image");
});

const carousels = document.querySelectorAll(".carousel__wrapper")
for (let carousel of carousels) {
  const id = carousel.parentElement.classList.contains("section-about__carousel") ? "about" : "team";
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
    const selector = parent.parentElement.classList.contains("section-about__carousel") ? ".section-about__card" : ".section-team__card";

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

    if (parent.parentElement.classList.contains("section-about__carousel")) {
      aboutCurrent = finalIndex;
    } else {
      teamCurrent = finalIndex;
    }

    moveCarousel(finalIndex, selector);
  }
}

document.body.addEventListener('touchend', handleTouchEnd);