const tooltips = document.querySelectorAll(".tooltip")

function showTooltip(event) {
  const id = event.target.id;
  const tooltip = document.getElementById(`tooltip-${id}`);

  for (let temp of tooltips) {
    if (temp !== tooltip) {
      temp.classList.add("tooltip_hidden");
      temp.classList.add("can-animate_hidden-at-first");
      temp.classList.remove("can-animate_shown");
      temp.classList.remove("tooltip_shown");
    }
  }

  tooltip.classList.toggle("tooltip_hidden");
  tooltip.classList.toggle("can-animate_hidden-at-first");
  tooltip.classList.toggle("can-animate_shown");
  tooltip.classList.toggle("tooltip_shown");

  if (tooltip.classList.contains("tooltip_shown")) {
    const topOfTooltip = event.target.getBoundingClientRect().top - document.querySelector(".world-map").getBoundingClientRect().top - tooltip.getBoundingClientRect().height;
    tooltip.style.top = `${topOfTooltip}px`;
    const leftOfTooltip = event.target.getBoundingClientRect().left - tooltip.getBoundingClientRect().width / 2 - document.querySelector(".world-map").getBoundingClientRect().left + 2.5;
    tooltip.style.left = `${leftOfTooltip}px`;
  } else {
    tooltip.style.top = "";
    tooltip.style.left = "";
  }
}

function showDialog(event) {
  const dialog = document.querySelector(".dialog");
  const id = event.target.id;
  const tooltip = document.getElementById(`tooltip-${id}`);
  const description = tooltip.querySelector(".tooltip__description").innerHTML;

  dialog.querySelector(".dialog__text-content").innerHTML = description;
  dialog.showModal();
}

document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("world-map__geomark")) {
    if (window.matchMedia("(min-width: 768px)").matches) {
      showTooltip(event);
    } else {
      showDialog(event);
    }
  }
});

window.addEventListener("resize", () => {
  for (let temp of tooltips) {
    temp.classList.add("tooltip_hidden");
    temp.classList.add("can-animate_hidden-at-first");
    temp.classList.remove("can-animate_shown");
    temp.classList.remove("tooltip_shown");

    temp.style.top = "";
    temp.style.left = "";
  }
});

const closeButton = document.querySelector(".dialog .dialog__close-button");
closeButton.addEventListener("click", () => {
  closeButton.parentElement.close();
})