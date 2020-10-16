function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = "0" + date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ":" + minutes.substr(-2); //  + ':' + s
}

function _parseDateObjectIntoTime(date) {
  //Get hours from milliseconds
  // Hours part from the timestamp
  const hours = "0" + date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ":" + minutes.substr(-2); //  + ':' + s
}

const itBeNight = function () {
  document.querySelector("html").classList.remove("is-day");
  document.querySelector("html").classList.add("is-night");
};

const itBeDay = function () {
  document.querySelector("html").classList.remove("is-night");
  document.querySelector("html").classList.add("is-day");
};

// 5 TODO: maak updateSun functie
const updateSun = function (currentTime, valueLeft, valueBottom, sun) {
  sun.setAttribute("data-time", _parseDateObjectIntoTime(currentTime));
  sun.style.left = `${valueLeft}%`;
  sun.style.bottom = `${valueBottom}%`;
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
const placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  const sun = document.querySelector(".js-sun"),
    minutesLeft = document.querySelector(".js-time-left");
  // Bepaal het aantal minuten dat de zon al op is.
  let currentTime = new Date(),
    sunriseDate = new Date(sunrise * 1000);
  let minutesSunUp =
    currentTime.getHours() * 60 +
    currentTime.getMinutes() -
    (sunriseDate.getHours() * 60 + sunriseDate.getMinutes());
  //console.log(minutesSunUp)
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  let percentage = (minutesSunUp / totalMinutes) * 100,
    valueLeft = percentage,
    valueBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;
  //console.log(currentTime, valueLeft, valueBottom, sun)
  updateSun(currentTime, valueLeft, valueBottom, sun);
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  document.querySelector("body").classList.add("is-loaded");
  // Vergeet niet om het resterende aantal minuten in te vullen.
  let minutesLeftCalculation = totalMinutes - minutesSunUp;
  minutesLeft.innerText = minutesLeftCalculation;
  // Nu maken we een functie die de zon elke minuut zal updaten
  const updatePerMinute = setInterval(() => {
    if (minutesSunUp > totalMinutes) {
      clearInterval(updatePerMinute);
      itBeNight();
      //savonslaat
    } else if (minutesSunUp < 0) {
      itBeNight();
      //smorgensvroeg
    } else {
      console.info("Het is dag, ik ben geupdate");
      itBeDay();
      //minutesSunUp = (currentTime.getHours() * 60 + currentTime.getMinutes()) - (sunriseDate.getHours() * 60 + sunriseDate.getMinutes());
      minutesSunUp++;
      (currentTime = new Date()), (sunriseDate = new Date(sunrise * 1000));
      (percentage = (minutesSunUp / totalMinutes) * 100),
        (valueLeft = percentage),
        (valueBottom =
          percentage < 50 ? percentage * 2 : (100 - percentage) * 2);
      updateSun(currentTime, valueLeft, valueBottom, sun);
      minutesLeftCalculation =
        totalMinutes - minutesSunUp < 0 ? 0 : totalMinutes - minutesSunUp;
      minutesLeft.innerText = minutesLeftCalculation;
    }
  }, 60000);
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  const location = document.querySelector(".js-location");
  location.innerText = `${queryResponse.city.name}, ${queryResponse.city.country}`;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  document.querySelector(
    ".js-sunrise"
  ).innerText = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
  document.querySelector(
    ".js-sunset"
  ).innerText = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  let totalMinutes = queryResponse.city.sunset - queryResponse.city.sunrise;
  totalMinutes = totalMinutes / 60;
  //console.log(totalMinutes, queryResponse.city.sunrise);
  placeSunAndStartMoving(totalMinutes, queryResponse.city.sunrise);
};

const getData = async function (endpoint) {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    showResult(data);
  } catch (error) {
    console.error("An error occured, we handled it.", error);
  }
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = (lat, lon) => {
  // Eerst bouwen we onze url op
  let endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8064e0b6a2adc9406971f3c18e163b8b&units=metric&lang=nl&cnt=1`;
  getData(endpoint);
};

document.addEventListener("DOMContentLoaded", function () {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
