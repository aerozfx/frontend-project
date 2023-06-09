import { symbols } from "./symbols.js";
import {
  switchCurrencies,
  sendCurrencies,
  filterCurrencies,
  getHistorialRates,
} from "./logic.js";
const currencyCodes = Object.entries(symbols.symbols);
const mainSelector = document.querySelector("main");
const mainFeatureSelector = document.querySelector(".main-feature");
const currenciesSelector = mainFeatureSelector.querySelector(".currencies");
const mainTitle = document.querySelector(".main-title");

const changeCurrency = mainFeatureSelector.querySelector(".change-currency");
changeCurrency.addEventListener("click", () => {
  sendCurrenciesFunctionality(mainFeatureSelector);
});

const hamburguerButton = document.querySelector(".hamburguer");
hamburguerButton.addEventListener("click", () => {
  const menu = document.querySelector(".list-items");
  menu.classList.toggle("open-menu");
});
// Inicialización de Google Maps
let map, service, infowindow;
const initMap = () => {
  if (navigator.geolocation) {
    const success = (position) => {
      let { latitude: lat, longitude: long } = position.coords;
      const userLocation = { lat: +lat.toFixed(3), lng: +long.toFixed(3) };
      map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 18,
        center: userLocation,
      });

      let userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
        },
      });
      userMarker.addListener("click", () => {
        infowindow.setContent("Estás aquí");
        infowindow.open({
          anchor: userMarker,
          map,
        });
      });
      infowindow = new google.maps.InfoWindow();
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
        }
      });
      map.setCenter(userMarker.position);
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
  let address = place.vicinity.split(", ");
  address.length = address.length - 1;
  address = address.join(", ");
  marker.addListener("click", () => {
    let innerMarkerHTML = `<b>${place.name}</b><div><b>${address}</b></div>`;
    if (place.opening_hours.isOpen)
      innerMarkerHTML += `<div>Está abierto</div>`;
    infowindow.setContent(innerMarkerHTML);
    infowindow.open({
      anchor: marker,
      map,
      innerMarkerHTML,
    });
  });
};

window.initMap = initMap();

const currencySelector = document.querySelectorAll(".option-selected");
currencySelector.forEach((item) => {
  const select = document.createElement("div");
  item.addEventListener("click", (event) => {
    select.classList.toggle("select-main");
    select.innerHTML = createCurrencyView();
    const ulSelector = select.querySelector("ul");

    // Recorremos el objeto para rellenar la lista de posibles opciones y creamos un elemento li por cada registro
    for (let [countryCode, localCurrency] of currencyCodes) {
      ulSelector.innerHTML += createListItems(countryCode, localCurrency);
    }
    mainSelector.appendChild(select);
    const li = select.querySelectorAll("ul li");
    addFunctionalityListItems(li, item);
    filterCurrenciesByInput(select, ulSelector, li, item);
    addFunctionalityFilteredItems(currenciesSelector, item);
    closeSelectCurrency(select);
    switchSelectedOptions();
  });
});

const sendCurrenciesFunctionality = (selector) => {
  if (selector.querySelector(".currency-result") == null) {
    sendCurrencies();
  }

  if (selector.querySelector(".currency-result") != null) {
    document.querySelector(".map-container").classList.toggle("hidden");
  }
};

const switchSelectedOptions = () => {
  const switchCurrenciesSelector = document.querySelector(".switch-currencies");
  switchCurrenciesSelector.addEventListener("click", () => {
    switchCurrencies();
  });
};

const switchCurrenciesSelector = document.querySelector(".switch-currencies");
switchCurrenciesSelector.addEventListener("click", () => {
  switchCurrencies();
});

// Creamos la vista Currency
const currencyButton = mainSelector.querySelector(".btn-currency");
currencyButton.addEventListener("click", (e) => {
  e.target.classList.toggle("active");
  e.target.classList.toggle("no-active");
  chartButton.classList.toggle("no-active");
  chartButton.classList.toggle("active");

  currenciesSelector.innerHTML = createConvertCurrencyView();
  addFunctionalityCurrencyView();
  switchSelectedOptions();
  const changeCurrencyButton = document.querySelector(".change-currency");
  changeCurrencyButton.addEventListener("click", () => {
    if (mainFeatureSelector.querySelector(".currency-result") == null) {
      sendCurrencies();
    }

    if (mainFeatureSelector.querySelector(".currency-result") != null) {
      document.querySelector(".map-container").classList.toggle("hidden");
    }
  });

  mainTitle.innerHTML = "Conversor de divisas";
});

const createConvertCurrencyView = () => {
  return `
  <label for="input-currency" class="input-selector">
    <span>INPUT</span>
    <input type="text" class="input-selected" />
  </label>
  <section class="currency-exchange">
    <label class="currency-selector">
      <span>FROM</span>
      <div class="option-selected"></div>
    </label>
    <label class="currency-selector">
      <span>TO</span>
      <div class="option-selected"></div>
    </label>
    <div class="switch-currencies">
      <span>Switch Currencies</span>
      <div class="switch-icons">
        <img src="./assets/images/exchange-arrows.png" alt="" />
      </div>
    </div>
  </section>
  <button class="change-currency">CONVERTIR</button>`;
};

const addFunctionalityCurrencyView = () => {
  const container = document.querySelector(".currencies");
  const currencySelector = container.querySelectorAll(".option-selected");
  currencySelector.forEach((item) => {
    item.addEventListener("click", () => {
      createCurrencySelectorList();
      const select = document.querySelector(".select-main");
      const ulSelector = select.querySelector("ul");
      const liSelector = ulSelector.querySelectorAll("li");
      addFunctionalityListItems(liSelector, item);
      filterCurrenciesByInput(select, ulSelector, liSelector, item);
      addFunctionalityFilteredItems(select);
    });
  });
};
// Creamos la vista Chart
const chartButton = mainSelector.querySelector(".btn-chart");
chartButton.addEventListener("click", (e) => {
  const map = mainFeatureSelector.querySelector(".map-container");
  map.classList.add("hidden");
  e.target.classList.toggle("active");
  e.target.classList.toggle("no-active");
  currencyButton.classList.toggle("no-active");
  currencyButton.classList.toggle("active");

  mainFeatureSelector.classList.add("chart-view");
  currenciesSelector.innerHTML = creteChartView();
  addFunctionalityChartView();
  switchSelectedOptions();
  mainTitle.innerHTML = "Gráficas";
});

const closeSelectCurrency = (selector) => {
  selector.querySelector(".btn-close").addEventListener("click", () => {
    selector.classList.toggle("select-main");
    document.querySelector("main").removeChild(selector);
  });
};

const createCurrencyView = () => {
  return `
  <article class="search-currency-container">
    <input class="search-currency" autofocus></input><ion-icon class="btn-close" name="close-circle-outline"></ion-icon>
  </article>
    <ul></ul>`;
};

const createListItems = (countryCode, localCurrency) => {
  let cod = countryCode.slice(0, 2).toLowerCase();
  return `<li class="option"><span class="fi fi-${cod}"></span><span>${countryCode} - ${localCurrency}</span></li>`;
};

const creteChartView = () => {
  return `  
  <label class="currency-selector">
    <span>FROM</span>
    <div class="option-selected"></div>
  </label>
  <label class="currency-selector">
  <span>TO</span>
  <div class="option-selected"></div>
  </label>
  <div class="switch-currencies">
  <span>Switch Currencies</span>
    <div class="switch-icons">
      <img src="./assets/images/exchange-arrows.png" alt="" />
    </div>
  </div>
  <button class="btn-show-chart">Mostrar gráfica</button>
  <div class="hidden currency-chart">
    <canvas id="chart"></canvas>
  </div>
  <section class="hidden exchange-section">
    <h2>Tabla de cambio</h2>
    <article class="table-exchange">
    </article>
    <article class="table-exchange"></article>
  </section>`;
};

const addFunctionalityChartView = () => {
  const container = document.querySelector(".currencies");
  const currencySelector = container.querySelectorAll(".option-selected");
  currencySelector.forEach((item) => {
    item.addEventListener("click", () => {
      createCurrencySelectorList();
      const select = document.querySelector(".select-main");
      const ulSelector = select.querySelector("ul");
      const liSelector = ulSelector.querySelectorAll("li");
      addFunctionalityListItems(liSelector, item);
      filterCurrenciesByInput(select, ulSelector, liSelector, item);
      addFunctionalityFilteredItems(select);
    });
  });
  const showChartButton = container.querySelector(".btn-show-chart");
  showChartButton.addEventListener("click", () => {
    const chartSelector = container.querySelector(".currency-chart");
    const exchangeSection = container.querySelector(".exchange-section");
    chartSelector.classList.toggle("hidden");
    exchangeSection.classList.toggle("hidden");
    getHistorialRates();
  });
};

const createCurrencySelectorList = () => {
  const select = document.createElement("div");
  select.classList.toggle("select-main");
  select.innerHTML = createCurrencyView();
  const ulSelector = select.querySelector("ul");

  // Crea la lista de ListItems dentro de UL
  for (let [countryCode, localCurrency] of currencyCodes) {
    ulSelector.innerHTML += createListItems(countryCode, localCurrency);
  }

  closeSelectCurrency(select);
  mainSelector.appendChild(select);
};

const addFunctionalityListItems = (arr, item) => {
  arr.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      addValueToCurrencySelector(e, item);
    });
  });
};

const filterCurrenciesByInput = (
  selectSelector,
  ulSelector,
  liSelector,
  item
) => {
  const searchCurrency = selectSelector.querySelector(".search-currency");
  searchCurrency.addEventListener("input", (e) => {
    ulSelector.innerHTML = "";
    let filteredArray = filterCurrencies(e.target.value);
    liSelector.forEach((ele) => {
      for (let i = 0; i < filteredArray.length; i++) {
        if (ele.innerText.includes(filteredArray[i]))
          ulSelector.innerHTML += `<li class="option sort">${ele.innerHTML}</li>`;
      }
    });
    if (selectSelector.querySelector("ul").innerHTML == "") {
      selectSelector.querySelector(
        "ul"
      ).innerHTML = `<span class="no-currency">No existen resultados</span>`;
    }

    addFunctionalityFilteredItems(selectSelector, item);
  });
};

const addFunctionalityFilteredItems = (select, item) => {
  let newListItems = select.querySelectorAll(".sort");
  newListItems.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      addValueToCurrencySelector(e, item);
    });
  });
};

const addValueToCurrencySelector = (e, item) => {
  const select = document.querySelector(".select-main");
  const code = e.target.innerText.slice(0, 2).toLowerCase();
  item.innerHTML = setCurrencySelected(code, e);
  select.classList.toggle("select-main");
  document.querySelector("main").removeChild(select);
};

const setCurrencySelected = (code, e) => {
  return `
 <div class="option-info">
 <span class="fi fi-${code}"></span>
 <span>&nbsp;</span>
 <span class="current-currency">${e.target.innerText}</span>
 </div>
 <ion-icon name="chevron-down-outline"></ion-icon>
 `;
};
