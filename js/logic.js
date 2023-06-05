import { API_KEY } from "./credentials.js";

export const switchCurrencies = () => {
  const options = document.querySelectorAll(".option-selected");
  let selectedOptions = {
    firstOption: options[0].innerHTML,
    secondOption: options[1].innerHTML,
  };
  options[0].innerHTML = selectedOptions.secondOption;
  options[1].innerHTML = selectedOptions.firstOption;
};

export const sendCurrencies = async () => {
  const options = document.querySelectorAll(".current-currency");
  let obj = {
    fromCurrency: options[0].innerHTML.slice(0, 3),
    toCurrency: options[1].innerHTML.slice(0, 3),
  };

  await fetchCurrencies(obj).then((data) => showResults());
};

const fetchCurrencies = async (obj) => {
  return fetch(
    `http://data.fixer.io/api/latest?access_key=${API_KEY}&base=${obj.fromCurrency}&symbols=${obj.toCurrency}`
  )
    .then((res) => res.json())
    .then((data) => console.log(data));
};

const showResults = () => {
  const section = document.createElement("section");
  section.className = "currency-result";
  const currencies = document.querySelector(".currencies");
  const currencyExchange = `
  <div>
    <h3>1.50 From Moneda</h3>
    <h2>1.50 To Moneda</h2>
    <h5>1 From Moneda = 1 To Moneda</h5>
    <h5>1 To Moneda = 1 From Moneda</h5>
  </div>`;
  section.innerHTML = currencyExchange;
  const button = document.querySelector(".change-currency");
  currencies.insertBefore(section, button);
  document.querySelector(".change-currency").setAttribute("disabled", "");
};
