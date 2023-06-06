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

  await fetchCurrencies(obj).then((data) => showResults(data));
};

const fetchCurrencies = async (obj) => {
  const res = await fetch(
    `http://data.fixer.io/api/latest?access_key=${API_KEY}&base=${obj.fromCurrency}&symbols=${obj.toCurrency}`
  );
  const data = await res.json();
  return data;
};

const showResults = (data) => {
  const resultsSection = document.createElement("section");
  resultsSection.className = "currency-result";
  const currencies = document.querySelector(".currencies");
  const button = document.querySelector(".change-currency");
  let codes = formatCurrencies();
  const resultsHTML = `
  <div>
    <h3>${codes.userAmount} ${codes.firstCurrency} =</h3>
    <h2>${codes.userAmount * data.rates[codes.secondCurrencyCode]} ${
    codes.secondCurrency
  }</h2>
    <h5>1 ${codes.firstCurrency} = ${data.rates[codes.secondCurrencyCode]} ${
    codes.secondCurrency
  }</h5>
    <h5>1 ${codes.secondCurrency} = ${(
    1 / data.rates[codes.secondCurrencyCode]
  ).toFixed(6)} ${codes.firstCurrency}</h5>
  </div>`;
  if (resultsSection.innerHTML === "") {
    resultsSection.innerHTML = resultsHTML;
    currencies.insertBefore(resultsSection, button);
  }
  button.innerHTML = "Mostrar casas de cambio";
};

const formatCurrencies = () => {
  const userAmount = document.querySelector(".input-selected");
  const currenciesSelected = document.querySelectorAll(".current-currency");
  let currenciesArray = [];
  for (let i = 0; i < currenciesSelected.length; i++) {
    currenciesArray.push(currenciesSelected[i].innerHTML.split(" - "));
  }
  let obj = {
    firstCurrencyCode: currenciesArray[0][0],
    firstCurrency: currenciesArray[0][1],
    secondCurrencyCode: currenciesArray[1][0],
    secondCurrency: currenciesArray[1][1],
    userAmount: userAmount.value,
  };
  return obj;
};
const createCurrencySection = () => {};
