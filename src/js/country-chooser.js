const countryChooserOpener = document.getElementById("open-country-chooser");
const optionsList = document.querySelector(".feedback-form__options");

const placeholders = {
  "US": "+1 (555) 000-0000",
  "Turkey": "+90 (555) 000-0000",
  "Australia":  "+61 2 0000 0000",
  "Britain": "+44 0000 0000",
  "France": "+33 1 23 45 67 89",
  "Argentina": "+54 9 000 000 0000",
  "Indonesia": "+62 00 0000 0000",
  "Israel": "+972-0-000-0000",
  "Japan": "+81 (012)-345-6789",
  "Mexico": "+52 (123) 456-7890",
  "South Africa": "+27-12-345-6789",
}

countryChooserOpener.addEventListener("click", () => {
  optionsList.classList.toggle("feedback-form__options_show");
  if (countryChooserOpener.firstElementChild.alt === "Open menu") {
    countryChooserOpener.firstElementChild.alt = "Close menu";
  } else {
    countryChooserOpener.firstElementChild.alt = "Open menu";
  }
});

optionsList.addEventListener("click", (event) => {
  if (event.target.classList.contains("feedback-form__option")) {
    const chosenCountry = event.target.textContent;
    document.getElementById("selected-name").innerHTML = chosenCountry;
    optionsList.classList.remove("feedback-form__options_show");
    countryChooserOpener.firstElementChild.alt = "Close menu";
    const placeholder = placeholders[chosenCountry];
    document.getElementById("phone").placeholder = placeholder;
  }
})