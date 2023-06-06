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

  if (currencies.querySelector(".currency-result") != null) {
    document.querySelector("#map").classList.toggle("hidden");
  }
});

let map, service;
const initMap = () => {
  if (navigator.geolocation) {
    const success = (position) => {
      let { latitude: lat, longitude: long } = position.coords;
      const userLocation = { lat: +lat.toFixed(3), lng: +long.toFixed(3) };
      map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 16,
        center: userLocation,
      });

      let reqObj = {
        location: userLocation,
        radius: "500",
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
};

window.initMap = initMap();
