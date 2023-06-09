import { API_KEY } from "./credentials.js";
import { symbols } from "./symbols.js";

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
    <h2>${(codes.userAmount * data.rates[codes.secondCurrencyCode]).toFixed(
      6
    )} ${codes.secondCurrency}</h2>
    <h5>1 ${codes.firstCurrencyCode} = ${data.rates[
    codes.secondCurrencyCode
  ].toFixed(6)} ${codes.secondCurrencyCode}</h5>
    <h5>1 ${codes.secondCurrencyCode} = ${(
    1 / data.rates[codes.secondCurrencyCode]
  ).toFixed(6)} ${codes.firstCurrencyCode}</h5>
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

export const filterCurrencies = (currency) => {
  const currenciesArray = Object.values(symbols.symbols);
  let reg = new RegExp(`.*(${currency}.*).*`, "gmi");
  return currenciesArray.filter((ele) => reg.test(ele));
};

export const getHistorialRates = async () => {
  const currenciesSelected = document.querySelectorAll(".current-currency");
  let obj = {
    fromCurrency: currenciesSelected[0].innerText,
    fromCurrencyCode: formatCode(currenciesSelected[0]),
    toCurrency: currenciesSelected[1].innerText,
    toCurrencyCode: formatCode(currenciesSelected[1]),
  };
  await fetchHistoricalRates(obj).then((data) => {
    let { fromCurrency, fromCurrencyCode, toCurrency, toCurrencyCode, rates } =
      data[data.length - 1];
    createChart(data);
    fillExchangeTable(
      0,
      { title: formatCurrency(fromCurrency), code: fromCurrencyCode },
      {
        title: formatCurrency(toCurrency),
        code: toCurrencyCode,
        rates: rates[toCurrencyCode],
      }
    );
    fillExchangeTable(
      1,
      { title: formatCurrency(toCurrency), code: toCurrencyCode },
      {
        title: formatCurrency(fromCurrency),
        code: fromCurrencyCode,
        rates: 1 / rates[toCurrencyCode],
      }
    );
  });
};

const fetchHistoricalRates = async (obj) => {
  let date = formatDate();
  let promises = date.map(async (ele) => {
    return await fetch(
      `https://data.fixer.io/api/${ele}?access_key=${API_KEY}&base=${obj.fromCurrencyCode}&symbols=${obj.toCurrencyCode}`
    )
      .then((res) => res.json())
      .then((data) => {
        let { fromCurrency, fromCurrencyCode, toCurrency, toCurrencyCode } =
          obj;
        let { rates } = data;
        let date = ele.split("-");
        return {
          fromCurrency,
          fromCurrencyCode,
          toCurrency,
          toCurrencyCode,
          rates,
          date: `${date[1]}-${date[2]}`,
        };
      });
  });
  return await Promise.all(promises).then((data) => data);
};

const formatDate = () => {
  // let date = new Date();
  // let year = date.getFullYear().toString();
  // let month = (date.getMonth() + 1).toString();
  // if (month.length === 1) month = `0${month}`;
  // let day = date.getDate();
  // if (day.length === 1) day = `0${day}`;
  let date = "2023-06-08";
  date = date.split("-");
  let dateFormatted = [];
  for (let i = date[2] - 1; i > date[2] - 8; i--) {
    dateFormatted.push(`${date[0]}-${date[1]}-0${i}`);
  }
  return dateFormatted;
};

const createChart = (obj) => {
  let dates = [];
  let value = [];
  for (let i = obj.length - 1; i >= 0; i--) {
    value.push(obj[i].rates[obj[0].toCurrencyCode]);
    dates.push(obj[i].date);
  }
  new Chart(chart, {
    type: "line",
    data: {
      labels: [...dates],
      datasets: [
        {
          label: `Value of ${obj[0].toCurrencyCode}`,
          data: [...value],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: Math.min(...value),
          max: Math.max(...value),
          beginAtZero: true,
        },
      },
    },
  });
};

const fillExchangeTable = (num, obj1, obj2) => {
  const mainFeatureSelector = document.querySelector(".main-feature");
  const table = mainFeatureSelector.querySelectorAll(".table-exchange");
  table[num].innerHTML = `
  <span class="table-title">${obj1.title} - ${obj2.title}</span>
  <section class="table-content">
    <span class="table-row">1 ${obj1.code} - ${(1 * obj2.rates).toFixed(4)} ${
    obj2.code
  }</span>
    <span class="table-row">10 ${obj1.code} - ${(10 * obj2.rates).toFixed(4)} ${
    obj2.code
  }</span>
    <span class="table-row">50 ${obj1.code} - ${(50 * obj2.rates).toFixed(4)} ${
    obj2.code
  }</span>
    <span class="table-row">100 ${obj1.code} - ${(100 * obj2.rates).toFixed(
    4
  )} ${obj2.code}</span>
    <span class="table-row">500 ${obj1.code} - ${(500 * obj2.rates).toFixed(
    4
  )} ${obj2.code}</span>
  </section>
  `;
};

const formatCode = (str) => {
  return str.innerText.slice(0, 3);
};

const formatCurrency = (str) => {
  return str.split(" - ")[1];
};
