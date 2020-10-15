let sun, timeLeft;

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
const updateSun = function (left, bottom, currentTime) {
  sun.setAttribute(
    "data-time",
    _parseMillisecondsIntoReadableTime(currentTime.getTime())
  );
  sun.style.left = `${left}%`;
  sun.style.bottom = `${bottom}%`;
};

const itBeNight = function () {
  document.querySelector("html").classList.remove("is-day");
  document.querySelector("html").classList.add("is-night");
};

const itBeDay = function () {
  document.querySelector("html").classList.remove("is-night");
  document.querySelector("html").classList.add("is-day");
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
const placeSunAndStartMoving = (totalSunTime, sunrise) => {
  sun = document.querySelector(".js-sun");
  timeLeft = document.querySelector(".js-time-left");
  const currentTime = new Date();
  let timeSunUp = currentTime.getTime() - sunrise;
  const timeBeforeNight =
    totalSunTime - timeSunUp < 0 ? 0 : totalSunTime - timeSunUp;
  const percentageGone = (100 / totalSunTime) * timeSunUp;
  const left = percentageGone,
    bottom =
      percentageGone < 50 ? percentageGone * 2 : (100 - percentageGone) * 2;
  updateSun(left, bottom, currentTime);
  document.querySelector(".js-time-left").innerText = timeBeforeNight / 60;
  document.querySelector("body").classList.add("is-loaded");
  // We voegen ook de 'is-loaded' class toe aan de body-tag.

  const updatePerMinute = setInterval(() => {
    console.log("update");
    if (timeSunUp > totalSunTime) {
      clearInterval(updatePerMinute);
      itBeNight();
    } else if (timeSunUp < 0) {
      itBeNight();
    } else {
      itBeDay();
      const currentTime = new Date(),
        percentageGone = (100 / totalSunTime) * timeSunUp,
        left = percentageGone,
        bottom =
          percentageGone < 50 ? percentageGone * 2 : (100 - percentageGone) * 2;
      updateSun(left, bottom, currentTime);
      timeBeforeNight =
        totalSunTime - timeSunUp < 0 ? 0 : totalSunTime - timeSunUp;
      document.querySelector(".js-time-left").innerText = timeBeforeNight / 60;
      timeSunUp = currentTime.getTime() - sunrise;
    }
  }, 1000);
};

// 3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => {
  const api = {};

  api.city = queryResponse.city.name;
  api.country = queryResponse.city.country;
  api.sunrise = queryResponse.city.sunrise;
  api.sunset = queryResponse.city.sunset;

  document.querySelector(
    ".js-location"
  ).innerText = `${api.city}, ${api.country}`;

  document.querySelector(
    ".js-sunrise"
  ).innerText = _parseMillisecondsIntoReadableTime(api.sunrise);
  document.querySelector(
    ".js-sunset"
  ).innerText = _parseMillisecondsIntoReadableTime(api.sunset);

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
const getAPI = (lat, lon) => {
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
