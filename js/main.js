import { symbols } from "./symbols.js";
import { switchCurrencies, sendCurrencies } from "./logic.js";
const obj = Object.entries(symbols.symbols);

const currencySelector = document.querySelectorAll(".currency-selector");
const select = document.createElement("div");
currencySelector.forEach((item) => {
  item.addEventListener("click", (event) => {
    select.classList.toggle("select-main");
    select.innerHTML = `<ul></ul>`;
    for (let [countryCode, localCurrency] of obj) {
      let cod = countryCode.slice(0, 2).toLowerCase();
      select.querySelector(
        "ul"
      ).innerHTML += `<li class="option"><span class="fi fi-${cod}"></span><span>${countryCode} - ${localCurrency} </span></li>`;
      document.querySelector("main").appendChild(select);
      const li = select.querySelectorAll("ul li");
      li.forEach((ele) => {
        ele.addEventListener("click", (e) => {
          select.classList.toggle("select-main");
          console.log(event.target.querySelector(".option-selected"));
          const code = e.target.innerText.slice(0, 2).toLowerCase();
          event.target.querySelector(".option-selected").innerHTML = `
              <div class="option-info">
                <span class="fi fi-${code}"></span>
                <span>&nbsp;</span>
                <span class="current-currency">${e.target.innerText}</span>
              </div>
              <ion-icon name="chevron-down-outline"></ion-icon>
            `;
          document.querySelector("main").removeChild(select);
        });
      });
    }
  });
});

const switchCurrenciesSelector = document.querySelector(".switch-currencies");

switchCurrenciesSelector.addEventListener("click", () => {
  switchCurrencies();
});

const changeCurrency = document.querySelector(".change-currency");

changeCurrency.addEventListener("click", () => {
  const currencies = document.querySelector(".currencies");
  if (currencies.querySelector(".currency-result") == null) {
    sendCurrencies();
  }
});
