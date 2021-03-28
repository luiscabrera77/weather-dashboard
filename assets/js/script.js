// Global Variables
var API_KEY = '671217df49ec18f0d17df2fc5f7a9660';

// Global Variables
var searchedCity = "Nashville";
var searchedTemp = "90";
var searchedHumidity = "80%";
var searchedWind = "16 mph";
var searchedUVIndex = "230";
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];



// write inital city and weather
var currentEl = document.querySelector("#current");
var currentCity = document.createElement("h1");
currentCity.className = "display-4 text-white text-center mt-5 mb-2";
currentCity.textContent = "Currently in " + searchedCity;

currentEl.appendChild(currentCity);

var currentConditions = document.createElement("p");
currentConditions.className = "lead mb-4 text-white-50";

currentEl.appendChild(currentConditions);

var currentTemp = document.createElement("span");
currentTemp.textContent = "TEMP: " + searchedTemp;
currentTemp.className = "mx-3";

var currentHumidity = document.createElement("span");
currentHumidity.textContent = "HUMIDITY: " + searchedHumidity;
currentHumidity.className = "mx-3";

var currentWind = document.createElement("span");
currentWind.textContent = "WIND: " + searchedWind;
currentWind.className = "mx-3";

var currentUVIndex = document.createElement("span");
currentUVIndex.textContent = "UV INDEX: " + searchedUVIndex;
currentUVIndex.className = "mx-3";

currentConditions.appendChild(currentTemp);
currentConditions.appendChild(currentHumidity);
currentConditions.appendChild(currentWind);
currentConditions.appendChild(currentUVIndex);







fetch (
  "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + API_KEY
  )

//Search button event listener
var searchBtn = document.querySelector("#searchbutton");
searchBtn.addEventListener("click", function () {
  getSearchedCity();
})

// what the user search for
function getSearchedCity() {
  var searchedCity = document.getElementById("searchfield").value;
  searchedCity = searchedCity.replace(/\s+/g,' ');
  searchedCity = searchedCity.trim();
  currentCity.textContent = "Currently in " + searchedCity;
  searchHistory.push(searchedCity);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  document.getElementById("searchfield").value = "";
  return searchedCity;
}


