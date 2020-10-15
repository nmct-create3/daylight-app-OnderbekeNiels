// _ = helper functions
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

// 5 TODO: maak updateSun functie
const updateSun = function (timeSunUp, totalSunTime) {
  const percentageGone = (timeSunUp / totalSunTime) * 100;
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  const sun = document.querySelector(".js-sun");
  const timeLeft = document.querySelector(".js-time-left");
  // Bepaal het aantal minuten dat de zon al op is.
  const timeNow = new Date();
  const timeSunUp = timeNow.getTime() / 1000 - sunrise;
  //console.log(_parseMillisecondsIntoReadableTime(timeSunUp));
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  updateSun(timeSunUp, totalMinutes);
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  document.querySelector("body").classList.add("is-loaded");
  // Vergeet niet om het resterende aantal minuten in te vullen.
  const timeLeftCalc = totalMinutes - timeSunUp;
  console.log(timeLeftCalc);
  timeLeft.innerHTML = Math.round(timeLeftCalc / 60);
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  const api = {};
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  api.city = queryResponse.city.name;
  document.querySelector(".js-location").innerHTML = api.city;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  api.sunrise = queryResponse.city.sunrise;
  api.sunset = queryResponse.city.sunset;
  //api.sunrise = `${api.sunrise.getHours()}`;
  document.querySelector(
    ".js-sunrise"
  ).innerHTML = _parseMillisecondsIntoReadableTime(api.sunrise);
  document.querySelector(
    ".js-sunset"
  ).innerHTML = _parseMillisecondsIntoReadableTime(api.sunset);
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  const totalSunTime = api.sunset - api.sunrise;
  placeSunAndStartMoving(totalSunTime, api.sunrise);
};

const getData = async function (endpoint) {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(`Data from API:`);
    console.log(data);
    showResult(data);
  } catch (error) {
    console.error("An error occured, we handled it.", error);
  }
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
  // Eerst bouwen we onze url op
  let endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8064e0b6a2adc9406971f3c18e163b8b&units=metric&lang=nl&cnt=1`;
  getData(endpoint);
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener("DOMContentLoaded", function () {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
