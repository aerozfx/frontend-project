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

let map;
let service;
let infowindow;

export const initMap = () => {
  let mapContainer = document.createElement("div");
  mapContainer.id = "map";
  const mainSelector = document.querySelector(".main-feature");
  mainSelector.appendChild(mapContainer);

  if (navigator.geolocation) {
    let success = (position) => {
      let { latitude: lat, longitude: long } = position.coords;
      const userLocation = { lat: +lat.toFixed(3), lng: +long.toFixed(3) };
      map = new google.maps.Map(mapContainer, {
        zoom: 16,
        center: userLocation,
      });

      let reqObj = {
        location: userLocation,
        radius: "1000",
        type: ["bank"],
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(reqObj, (res, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < res.length; i++) {
            createMarker(res[i]);
          }
          map.setCenter(res[0].geometry.location);
        }
      });
    };

    navigator.geolocation.getCurrentPosition(success);
  }
};

const createMarker = (place) => {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
};
