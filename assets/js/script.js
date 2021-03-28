// Global Variables
var searchedTemp = "90";
var searchedHumidity = "80%";
var searchedWind = "16 mph";
var searchedUVIndex = "230";
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
if (searchHistory.length === 0) {
  var searchedCity = "Nashville";
}
else {
  var searchedCity = searchHistory[searchHistory.length - 1];
}
var geoCity;//= "48.8534&lon=2.3488"

// write inital city and weather
var currentEl = document.querySelector("#current");
var currentCity = document.createElement("h1");
currentCity.className = "display-4 text-white text-center mt-5 mb-2";
currentCity.textContent = "Currently in " + searchedCity;
currentEl.appendChild(currentCity);

// current conditions container
var currentConditions = document.createElement("p");
currentConditions.className = "lead mb-2 text-white-50";
currentEl.appendChild(currentConditions);
// current Temp
var currentTemp = document.createElement("span");
currentTemp.className = "mx-3";
currentConditions.appendChild(currentTemp);
// current Humidity
var currentHumidity = document.createElement("span");
currentHumidity.className = "mx-3";
currentConditions.appendChild(currentHumidity);
// current Wind
var currentWind = document.createElement("span");
currentWind.className = "mx-3";
currentConditions.appendChild(currentWind);
// current UVIndex
var currentUVIndex = document.createElement("span");
currentUVIndex.className = "mx-3";
currentConditions.appendChild(currentUVIndex);

// History
var citiesHistoryEl = document.querySelector("#searchhistory");
var clearCities = document.createElement("button");
clearCities.textContent = "clear";
clearCities.className = "btn btn-outline-danger btn-sm mb-2 px-3 mx-1";

clearCities.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
})

function updateHistory() {
  citiesHistoryEl.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    var previousCity = document.createElement("button");
    previousCity.className = "btn btn-outline-light btn-sm mb-2 px-3 mx-1";
    previousCity.textContent = searchHistory[i];
    citiesHistoryEl.appendChild(previousCity);
  }
  citiesHistoryEl.appendChild(clearCities);
  clearCities.hidden = false;

}

// Make nested fetch requests to Open Weather

function getWeather() {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity + "&limit=1&appid=671217df49ec18f0d17df2fc5f7a9660"
  )
    .then(function (geoResponse) {
      return geoResponse.json();
    })
    .then(function (geoResponse) {
      var lat = geoResponse[0].lat;
      var lon = geoResponse[0].lon;
      geoCity = lat + "&lon=" + lon;

      return fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        geoCity +
        "&units=imperial&exclude=hourly,daily&appid=671217df49ec18f0d17df2fc5f7a9660"
      );
    })
    .then(function (cityResponse) {
      return cityResponse.json();
    })
    .then(function (cityResponse) {
      currentTemp.textContent = "TEMP " + Math.round(cityResponse.current.temp) + " F";
      currentHumidity.textContent = "HUMIDITY " + Math.round(cityResponse.current.humidity) + "%";
      currentWind.textContent = "WIND " + Math.round(cityResponse.current.wind_speed) + " MPH";
      currentUVIndex.textContent = "UV INDEX " + Math.round(cityResponse.current.uvi) + " O";
    })
}
getWeather();


//Search functions
var searchBtn = document.querySelector("#searchbutton");
searchBtn.addEventListener("click", function () {
  getSearchedCity();
})

function getSearchedCity() {
  var searchedCity = document.getElementById("searchfield").value;
  //searchedCity = searchedCity.replace(/\s+/g,' '); //Cities like Porter Ranch fail
  searchedCity = searchedCity.trim();
  currentCity.textContent = "Currently in " + searchedCity;
  searchHistory.push(searchedCity);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  document.getElementById("searchfield").value = "";
  updateHistory();
  return searchedCity;
}

// also use enter to submit search
var searchedCity = document.getElementById("searchfield");
searchedCity.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("searchbutton").click();
  }
});

// load latest history and hide button if it is empty
updateHistory();

if (searchHistory.length === 0) {
  clearCities.hidden = true;
}