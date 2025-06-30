let newsCurrent = 0;
let reviewsCurrent = 0;
let scrollEnabled = { "news": true, "reviews": true };

function moveNext(current, selector, isResizing = false) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;
  const maxIndex = items.length - 1;
  const id = parent.parentElement.classList.contains("section-news__carousel") ? "news" : "reviews";


  if (current === maxIndex || Math.abs(items[maxIndex].getBoundingClientRect().right - parent.getBoundingClientRect().right) <= 1 && innerWidth >= 768 && items[current + 1]?.scrollWidth < parent.offsetWidth) {
    const delta = parent.scrollWidth;
    scrollEnabled[id] = false;
    parent.scrollBy({
      left: -delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent = 0;
    } else {
      reviewsCurrent = 0;
    }
  } else if (scrollEnabled[id] || isResizing) {
    const padding = parent.parentElement.classList.contains("section-news__carousel") ? 15 : 0
    const delta = isResizing ? items[current + 1].getBoundingClientRect().left - parent.getBoundingClientRect().left : (items[current + 1].getBoundingClientRect().width + padding);
    const behaviour = isResizing ? "instant" : "smooth";
    scrollEnabled[id] = false;
    parent.scrollBy({
      left: delta,
      behavior: behaviour
    });

    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent++;
    } else {
      reviewsCurrent++;
    }
  }
}

function movePrevious(current, selector, isResizing = false) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;

  const id = parent.parentElement.classList.contains("section-news__carousel") ? "news" : "reviews";

  if ((current === 0 || parent.scrollLeft === 0) && scrollEnabled[id]) {
    scrollEnabled[id] = false;
    const delta = parent.scrollWidth;
    parent.scrollBy({
      left: delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent = items.length - 1;
    } else {
      reviewsCurrent = items.length - 1;
    }
  } else if (scrollEnabled[id] || isResizing) {
    const padding = parent.parentElement.classList.contains("section-news__carousel") ? 15 : 0
    const delta = isResizing ? parent.getBoundingClientRect().left - items[current - 1].getBoundingClientRect().left : (items[current - 1].getBoundingClientRect().width + padding).toFixed(4);
    const behaviour = isResizing ? "instant" : "smooth";

    scrollEnabled[id] = false;
    parent.scrollBy({
      left: -delta,
      behavior: behaviour
    });

    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent--;
    } else {
      reviewsCurrent--;
    }
  }
}

document.getElementById("news-prev")?.addEventListener("click", () => {
  movePrevious(newsCurrent, ".section-news__card");
});

document.getElementById("news-next")?.addEventListener("click", () => {
  moveNext(newsCurrent, ".section-news__card");
});

document.getElementById("reviews-prev")?.addEventListener("click", () => {
  movePrevious(reviewsCurrent, ".review");
});

document.getElementById("reviews-next")?.addEventListener("click", () => {
  moveNext(reviewsCurrent, ".review");
});

window.addEventListener("resize", () => {
  moveCarousel(reviewsCurrent, ".review");
  moveCarousel(newsCurrent, ".section-news__card");
});

const carousels = document.querySelectorAll(".carousel__wrapper")
for (let carousel of carousels) {
  const id = carousel.parentElement.classList.contains("section-news__carousel") ? "news" : "reviews";
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
    const selector = parent.parentElement.classList.contains("section-news__carousel") ? ".section-news__card" : ".review";

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

    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent = finalIndex;
    } else {
      reviewsCurrent = finalIndex;
    }

    moveCarousel(finalIndex, selector);
  }
}


document.body.addEventListener('touchend', handleTouchEnd);