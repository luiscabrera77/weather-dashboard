// Global Variables
var searchedTemp = "90";
var searchedHumidity = "80%";
var searchedWind = "16 mph";
var searchedUVIndex = "230";

// Read local storage to write history and set last seen city
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
if (searchHistory.length === 0) {
  var searchedCity = "Nashville, US";
}
else {
  var searchedCity = localStorage.getItem("lastcity");
  //var searchedCity = searchHistory[searchHistory.length - 1];
}

// write time
var nowEl = document.querySelector("#now");
var now = document.createElement("a");
now.className = "nav-link small";
now.textContent = moment().format('lll');
now.href = "#";
nowEl.appendChild(now);

// write inital city and weather
var currentEl = document.querySelector("#current");
var currentCity = document.createElement("h1");
currentCity.className = "display-4 text-white text-center mt-5 mb-2";
currentCity.textContent = "Currently in " + searchedCity;
currentEl.appendChild(currentCity);

// forecast section
var forecastEl = document.querySelector("#forecast");

// select DIVS and write dates
var fElements = [];
for(var i = 1; i <= 5; i++) {
  fElements.push({
    dayImg: document.querySelector(`#day${i}img`),
    dayDate: document.querySelector(`#day${i}date`),
    dayTemp: document.querySelector(`#day${i}temp`),
    dayHumidity: document.querySelector(`#day${i}humidity`),
    dayTime: moment().add(i, 'd').format('ddd Do')
  });
}

/* The above replaced the following code:

var day01img = document.querySelector("#day1img");
var day01Date = document.querySelector("#day1date");
var day01Temp = document.querySelector("#day1temp");
var day01Humidity = document.querySelector("#day1humidity");
var day02img = document.querySelector("#day2img");
var day02Date = document.querySelector("#day2date");
var day02Temp = document.querySelector("#day2temp");
var day02Humidity = document.querySelector("#day2humidity");
var day03img = document.querySelector("#day3img");
var day03Date = document.querySelector("#day3date");
var day03Temp = document.querySelector("#day3temp");
var day03Humidity = document.querySelector("#day3humidity");
var day04img = document.querySelector("#day4img");
var day04Date = document.querySelector("#day4date");
var day04Temp = document.querySelector("#day4temp");
var day04Humidity = document.querySelector("#day4humidity");
var day05img = document.querySelector("#day5img");
var day05Date = document.querySelector("#day5date");
var day05Temp = document.querySelector("#day5temp");
var day05Humidity = document.querySelector("#day5humidity");

// forecast icons
var tempIcon01 = document.createElement("i");
tempIcon01.className = "fas fa-thermometer-half";
var humidityIcon01 = document.createElement("i");
humidityIcon01.className = "fas fa-tint";
var tempIcon02 = document.createElement("i");
tempIcon02.className = "fas fa-thermometer-half";
var humidityIcon02 = document.createElement("i");
humidityIcon02.className = "fas fa-tint";
var tempIcon03 = document.createElement("i");
tempIcon03.className = "fas fa-thermometer-half";
var humidityIcon03 = document.createElement("i");
humidityIcon03.className = "fas fa-tint";
var tempIcon04 = document.createElement("i");
tempIcon04.className = "fas fa-thermometer-half";
var humidityIcon04 = document.createElement("i");
humidityIcon04.className = "fas fa-tint";
var tempIcon05 = document.createElement("i");
tempIcon05.className = "fas fa-thermometer-half";
var humidityIcon05 = document.createElement("i");
humidityIcon05.className = "fas fa-tint";

// forecast dates
day01Date.textContent = moment().add(1, 'd').format('ddd Do');
day02Date.textContent = moment().add(2, 'd').format('ddd Do');
day03Date.textContent = moment().add(3, 'd').format('ddd Do');
day04Date.textContent = moment().add(4, 'd').format('ddd Do');
day05Date.textContent = moment().add(5, 'd').format('ddd Do');

*/

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

// history
var previousCity = document.createElement("button");

// create history buttons
function updateHistory() {
  citiesHistoryEl.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    var previousCity = document.createElement("button");
    previousCity.className = "btn btn-outline-light btn-sm mb-2 px-3 mx-1";
    previousCity.textContent = searchHistory[i];
    previousCity.id = searchHistory[i];
    previousCity.addEventListener("click", function () {
      document.getElementById("searchfield").className = "form-control mt-5";
      document.getElementById("searchfield").placeholder = "Search for a City, or any place you want.";
      searchedCity = this.id;
      //console.log(searchedCity);
      getWeather();
      now.textContent = moment().format('lll');
      localStorage.setItem("lastcity", this.id);
    });
    citiesHistoryEl.appendChild(previousCity);
  }
  citiesHistoryEl.appendChild(clearCities);
  clearCities.hidden = false;
}

// Make nested fetch requests to Open Weather
function getWeather() {
  //console.log(searchedCity);
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity + "&limit=1&appid=671217df49ec18f0d17df2fc5f7a9660"
  )
    .then(function (geoResponse) {
      //console.log(geoResponse);
      return geoResponse.json();
    })
    .then(function (geoResponse) {
      //console.log(geoResponse);
      var x = JSON.stringify(geoResponse.length);
      var y = geoResponse.cod;
      //console.log(y);
      if (x == "0" || y == "404") {
        document.getElementById("searchfield").className = "form-control mt-5 badsearch";
        document.getElementById("searchfield").placeholder = "Mhm... Please check name, doesn't seem right";
        return;
      }
      lat = geoResponse[0].lat;
      lon = geoResponse[0].lon;
      geoCity = lat + "&lon=" + lon;
      currentCity.textContent = geoResponse[0].name + ", " + geoResponse[0].country;

      return fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        geoCity +
        "&units=imperial&exclude=hourly,minutely&appid=671217df49ec18f0d17df2fc5f7a9660"
      );
    })
    .then(function (cityResponse) {
      //console.log(cityResponse);
      return cityResponse.json();
    })
    .then(function (cityResponse) {
      //console.log(cityResponse);

      var iconNow = cityResponse.current.weather[0].icon;
      var iconToday = document.createElement("img");
      iconToday.src = "https://openweathermap.org/img/wn/" + iconNow + "@2x.png";
      currentCity.prepend(iconToday);

      currentTemp.textContent = "TEMP " + Math.round(cityResponse.current.temp) + " F";
      currentHumidity.textContent = "HUMIDITY " + Math.round(cityResponse.current.humidity) + "%";
      currentWind.textContent = "WIND " + Math.round(cityResponse.current.wind_speed) + " MPH";

      if ((Math.round(cityResponse.current.uvi) < 3)) {
        currentUVIndex.textContent = "UV INDEX " + Math.round(cityResponse.current.uvi);
        currentUVIndex.className = "mx-3 small strong uv1-2";
      } else if ((Math.round(cityResponse.current.uvi) >= 3) && (Math.round(cityResponse.current.uvi) < 6)) {
        currentUVIndex.textContent = "UV INDEX " + Math.round(cityResponse.current.uvi);
        currentUVIndex.className = "mx-3 small strong uv3-5";
      } else if ((Math.round(cityResponse.current.uvi) >= 6) && (Math.round(cityResponse.current.uvi) < 8)) {
        currentUVIndex.textContent = "UV INDEX " + Math.round(cityResponse.current.uvi);
        currentUVIndex.className = "mx-3 small strong uv6-7";
      } else if ((Math.round(cityResponse.current.uvi) >= 8) && (Math.round(cityResponse.current.uvi) < 10)) {
        currentUVIndex.textContent = "UV INDEX " + Math.round(cityResponse.current.uvi);
        currentUVIndex.className = "mx-3 small strong uv8-10";
      } else if ((Math.round(cityResponse.current.uvi) >= 11)) {
        currentUVIndex.textContent = "UV INDEX " + Math.round(cityResponse.current.uvi);
        currentUVIndex.className = "mx-3 small strong uv11";
      }
      
      var iconday01 = cityResponse.daily[1].weather[0].icon;
      fElements[0].dayImg.src = "https://openweathermap.org/img/wn/" + iconday01 + "@4x.png";
      fElements[0].dayTemp.innerHTML = "<i class=\"fas fa-thermometer-half\"></i> " + Math.round(cityResponse.daily[1].temp.day) + " F";
      fElements[0].dayHumidity.innerHTML = "<i class=\"fas fa-tint\"></i> " + Math.round(cityResponse.daily[1].humidity) + "%";
      fElements[0].dayDate.innerHTML = fElements[0].dayTime;

      var iconday02 = cityResponse.daily[2].weather[0].icon;
      fElements[1].dayImg.src = "https://openweathermap.org/img/wn/" + iconday02 + "@4x.png";
      fElements[1].dayTemp.innerHTML = "<i class=\"fas fa-thermometer-half\"></i> " + Math.round(cityResponse.daily[2].temp.day) + " F";
      fElements[1].dayHumidity.innerHTML = "<i class=\"fas fa-tint\"></i> " + Math.round(cityResponse.daily[2].humidity) + "%";
      fElements[1].dayDate.innerHTML = fElements[1].dayTime;

      var iconday03 = cityResponse.daily[3].weather[0].icon;
      fElements[2].dayImg.src = "https://openweathermap.org/img/wn/" + iconday03 + "@4x.png";
      fElements[2].dayTemp.innerHTML = "<i class=\"fas fa-thermometer-half\"></i> " + Math.round(cityResponse.daily[3].temp.day) + " F";
      fElements[2].dayHumidity.innerHTML = "<i class=\"fas fa-tint\"></i> " + Math.round(cityResponse.daily[3].humidity) + "%";
      fElements[2].dayDate.innerHTML = fElements[2].dayTime;

      var iconday04 = cityResponse.daily[4].weather[0].icon;
      fElements[3].dayImg.src = "https://openweathermap.org/img/wn/" + iconday04 + "@4x.png";
      fElements[3].dayTemp.innerHTML = "<i class=\"fas fa-thermometer-half\"></i> " + Math.round(cityResponse.daily[4].temp.day) + " F";
      fElements[3].dayHumidity.innerHTML = "<i class=\"fas fa-tint\"></i> " + Math.round(cityResponse.daily[4].humidity) + "%";
      fElements[3].dayDate.innerHTML = fElements[3].dayTime;

      var iconday05 = cityResponse.daily[5].weather[0].icon;
      fElements[4].dayImg.src = "https://openweathermap.org/img/wn/" + iconday05 + "@4x.png";
      fElements[4].dayTemp.innerHTML = "<i class=\"fas fa-thermometer-half\"></i> " + Math.round(cityResponse.daily[1].temp.day) + " F";
      fElements[4].dayHumidity.innerHTML = "<i class=\"fas fa-tint\"></i> " + Math.round(cityResponse.daily[5].humidity) + "%";
      fElements[4].dayDate.innerHTML = fElements[4].dayTime;
      
      /* The above replaced the following code:
      var iconday01 = cityResponse.daily[1].weather[0].icon;
      day01img.src = "https://openweathermap.org/img/wn/" + iconday01 + "@4x.png";
      day01Temp.textContent = " " + Math.round(cityResponse.daily[1].temp.day) + " F";
      day01Temp.prepend(tempIcon01);
      day01Humidity.textContent = " " + Math.round(cityResponse.daily[1].humidity) + "%";
      day01Humidity.prepend(humidityIcon01);
      
      var iconday02 = cityResponse.daily[2].weather[0].icon;
      day02img.src = "https://openweathermap.org/img/wn/" + iconday02 + "@4x.png";
      day02Temp.textContent = " " + Math.round(cityResponse.daily[2].temp.day) + " F";
      day02Temp.prepend(tempIcon02);
      day02Humidity.textContent = " " + Math.round(cityResponse.daily[2].humidity) + "%";
      day02Humidity.prepend(humidityIcon02);
      var iconday03 = cityResponse.daily[3].weather[0].icon;
      
      day03img.src = "https://openweathermap.org/img/wn/" + iconday03 + "@4x.png";
      day03Temp.textContent = " " + Math.round(cityResponse.daily[3].temp.day) + " F";
      day03Temp.prepend(tempIcon03);
      day03Humidity.textContent = " " + Math.round(cityResponse.daily[3].humidity) + "%";
      day03Humidity.prepend(humidityIcon03);
      var iconday04 = cityResponse.daily[4].weather[0].icon;
      
      day04img.src = "https://openweathermap.org/img/wn/" + iconday04 + "@4x.png";
      day04Temp.textContent = " " + Math.round(cityResponse.daily[4].temp.day) + " F";
      day04Temp.prepend(tempIcon04);
      day04Humidity.textContent = " " + Math.round(cityResponse.daily[4].humidity) + "%";
      day04Humidity.prepend(humidityIcon04);
      var iconday05 = cityResponse.daily[5].weather[0].icon;
      
      day05img.src = "https://openweathermap.org/img/wn/" + iconday05 + "@4x.png";
      day05Temp.textContent = " " + Math.round(cityResponse.daily[5].temp.day) + " F";
      day05Temp.prepend(tempIcon05);
      day05Humidity.textContent = " " + Math.round(cityResponse.daily[5].humidity) + "%";
      day05Humidity.prepend(humidityIcon05);
      */
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}

getWeather();

//Search functions
var searchBtn = document.querySelector("#searchbutton");
searchBtn.addEventListener("click", function () {
  getSearchedCity();
  location.reload();
})

function getSearchedCity() {
  var searchedCity = document.getElementById("searchfield").value;
  searchedCity = searchedCity.trim();
  searchHistory.push(searchedCity);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  localStorage.setItem("lastcity", searchedCity);
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

// Update history, hide clear button if history is empty and give focus to search
updateHistory();

if (searchHistory.length === 0) {
  clearCities.hidden = true;
}
searchedCity.focus();