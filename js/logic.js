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

  await fetchCurrencies(obj);
};

const fetchCurrencies = async (obj) => {
  return fetch(
    `http://data.fixer.io/api/latest?access_key=${API_KEY}&base=${obj.fromCurrency}&symbols=${obj.toCurrency}`
  )
    .then((res) => res.json())
    .then((data) => console.log(data));
};
