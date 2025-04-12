let newsCurrent = 0;
let reviewsCurrent = 0;

function moveNext(current, selector, isResizing=false) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;
  const maxIndex = items.length - 1;
  const spaceLeft = parent.scrollWidth - parent.scrollLeft - (items[current + 1] ? Math.round(items[current + 1].scrollWidth) : 0) - 15;
  const isScrolledIntoView = Math.round(items[current].getBoundingClientRect().left - parent.getBoundingClientRect().left) >= 0 && Math.round(parent.getBoundingClientRect().right - items[current].getBoundingClientRect().right) >= 0
  
  if (current === maxIndex || Math.abs(Math.round(spaceLeft) - Math.round(items[current + 1].scrollWidth)) <= 1 && innerWidth >= 768 && items[current + 1].scrollWidth < parent.offsetWidth) {
    const delta = parent.scrollWidth;
    parent.scrollBy({
      left: -delta,
      behavior: "smooth"
    });

    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent = 0;
    } else {
      reviewsCurrent = 0;
    }
  } else if (isScrolledIntoView || isResizing) {
    const delta = isResizing ? items[current + 1].getBoundingClientRect().left - parent.getBoundingClientRect().left : items[current + 1].getBoundingClientRect().width + 15;
    const behaviour = isResizing ? "instant" : "smooth"; 
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

function movePrevious(current, selector, isResizing=false) {
  const items = Array.from(document.querySelectorAll(selector));
  const parent = items[0].parentElement;
  const isScrolledIntoView = Math.round(items[current].getBoundingClientRect().left - parent.getBoundingClientRect().left) >= 0 && Math.round(parent.getBoundingClientRect().right - items[current].getBoundingClientRect().right) >= 0;

  if (current === 0 || Math.round(parent.scrollLeft + 7.5) < items[current - 1].scrollWidth && isScrolledIntoView) {
    const delta = items.reduce((prev, item, index) => prev + (index > 0 ? item.getBoundingClientRect().width : 0), 0) + 15 * items.length;
    parent.scrollBy({
      left: delta,
      behavior: "smooth"
    })
    if (parent.parentElement.classList.contains("section-news__carousel")) {
      newsCurrent = items.length - 1;
    } else {
      reviewsCurrent = items.length - 1;
    }
  } else if (isScrolledIntoView || isResizing) {
    const delta = isResizing ? parent.getBoundingClientRect().left - items[current - 1].getBoundingClientRect().left : items[current - 1].getBoundingClientRect().width + 15;
    const behaviour = isResizing ? "instant" : "smooth"; 
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

document.getElementById("news-prev").addEventListener("click", () => {
  movePrevious(newsCurrent, ".section-news__card");
});

document.getElementById("news-next").addEventListener("click", () => {
  moveNext(newsCurrent, ".section-news__card");
});

document.getElementById("reviews-prev").addEventListener("click", () => {
  movePrevious(reviewsCurrent, ".review");
});

document.getElementById("reviews-next").addEventListener("click", () => {
  moveNext(reviewsCurrent, ".review");
});

window.addEventListener("resize", () => {
  if (newsCurrent > 0) {
    movePrevious(newsCurrent, ".section-news__card", 1);
    moveNext(newsCurrent, ".section-news__card", 1);
  }

  if (reviewsCurrent > 0) {
    movePrevious(reviewsCurrent, ".review", 1);
    moveNext(reviewsCurrent, ".review", 1);
  }
});