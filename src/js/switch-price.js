document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("thumb")) {
    const thumb = event.target;
    thumb.classList.toggle("thumb_off");

    if (!thumb.classList.contains("thumb_off")) {
      thumb.setAttribute("aria-label", "Annual pricing is chosen. Click to switch it.");
    } else {
      thumb.setAttribute("aria-label", "Annual pricing is not chosen. Click to switch it.");
    }

    changePricing();
  }
});

function changePricing() {
  const thumb = document.querySelector(".thumb");
  const pricings = document.querySelectorAll(".section-pricing__price-wrapper :first-child");

  for (let price of pricings) {
    let currentPrice;
    let period;
    if (thumb.classList.contains("thumb_off")) {
      currentPrice = parseInt(price.innerHTML.slice(1)) / (0.8 * 12);
      period = "mon";
    } else {
      currentPrice = parseInt(price.innerHTML.slice(1)) * 0.8 * 12;
      period = "yr";
    }

    price.innerHTML = `$${currentPrice.toFixed(0)}`;
    price.nextElementSibling.innerHTML = `/${period}`;
  }
}
