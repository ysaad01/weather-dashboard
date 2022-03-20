/* variables */
var apiKey = "5272f2f8906b594a33bc1da3553899cf";
var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
var exclude = "&exclude=minutely,hourly,alerts&units=imperial";
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
var searchForm = $("#search-form");
var cityInput = $("#searchCityName");
var cityExample = "Cleveland";
var day = 1;

/* load from local storage function */
function loadLocalStorage() {
  var storedArray = localStorage.getItem("citySearchStorage") ? JSON.parse(localStorage.getItem("citySearchStorage")) : []

  $("#searchHistoryList").empty();
  var searchLength = storedArray.length
  for (var i = searchLength - 1; i >= 0; i--) {
    if (i > searchLength - 11) {
      var searchItem = $(`<p class = "text-uppercase">${storedArray[i]}</p>`)
      searchItem.on("click", function () {
        currentForecast($(this).text())
      })
      /* access search history items */
      $("#searchHistoryList").append(searchItem);
    }
  }
}

/* search city function */
function searchCity(search) {
  search.preventDefault();

  var searchCityName = document.getElementById("searchCityName").value;

  if (searchCityName) {
    currentForecast(searchCityName);
    cityInput.value = "";
    saveCitySearch(searchCityName);
    loadLocalStorage();
  } else {
    alert("No City Entered")
  }
}

/* current weather function */
function currentForecast(currentCity) {

  /* fetching geoApiUrl */
  fetch(geoApiUrl + currentCity + "&appid=" + apiKey).then(function (response) {
    response.json().then(function (data) {
      
      /* using lat and lon from geoApiUrl and entering into onecall apiUrl */
      fetch(apiUrl + "lat=" + data[0].lat + "&lon=" + data[0].lon + exclude + "&appid=" + apiKey).then(function (weatherData) {
        return weatherData.json();
      }).then(function (currentData) {
        console.log(currentData);

        // USE MOMENT.JS TO SHOW DATE
        var currentDate = new Date(currentData.current.dt * 1000);
        // SHOW SEARCHED CITY NAME
        $("#city-search").text(
          currentCity + " " + moment(currentDate).format("dddd, MMMM Do YYYY")
        );
        // ADD ICON
        var iconCode = currentData.current.weather[0].icon;
        $(".wicon").attr(
          "src",
          `http://openweathermap.org/img/w/${iconCode}.png`
        );
        // SHOW CURRENT TEMP
        $("#temp-now").text(
          "Temperature: " + currentData.current.temp + " \u00B0F"
        );
        // SHOW CURRENT WIND SPEED
        $("#wind-now").text(
          "Wind Speed: " + currentData.current.wind_speed + " MPH"
        );
        // SHOW CURRENT HUMIDITY
        $("#humidity-now").text(
          "Humidity: " + currentData.current.humidity + " %"
        );
        // SHOW CURRENT UV INDEX
        $("#uv-now").text(currentData.current.uvi);

        // STYLING DEPENDING ON UV LEVEL
        var uvClassName = "";
        if (currentData.current.uvi < 3) {
          uvClassName = "uvGreen";
        } else if (currentData.current.uvi > 3 && currentData.current.uvi < 6) {
          uvClassName = "uvYellow";
        } else {
          uvClassName = "uvRed";
        }
        $("#uv-now").removeClass("uvGreen uvYellow uvRed");
        $("#uv-now").addClass(uvClassName);

        /* call 5 day forecast function */
        futureForecast(currentData);
      })
    })
  });
}

/* 5 day forecast function */
function futureForecast(futureData) {

  // LOOP THROUGH MOST RECENT 5 DAYS AND DISPLAY DATA
    $("#fiveDayForecast").empty();
    for (var i = 1; i < 6; i++) {
      // USE MOMENT.JS TO SHOW DAY
      var date = new Date(futureData.daily[i].dt * 1000)
      // MAKES 5 FORECAST CARDS

      var forecastCard = $("<div class='card col-md-2 col-sm-12 mb-2 bg-primary'></div>")
      forecastCard.html(`<div class="card-body forecast">
      <h6 class="card-title" id="d1">${moment(date).format("dddd, M/D")}</h6>
      <img class="wicon" alt="weather icon" src="http://openweathermap.org/img/w/${
        futureData.daily[i].weather[0].icon
      }.png"
      <p class="card-subtitle pb-2">Temp: ${
        futureData.daily[i].temp.day
      } \u00B0F</p>
      <p class="card-subtitle pb-2">Wind Speed: ${
        futureData.daily[i].wind_speed
      } MPH</p>
      <p class="card-subtitle pb-2">Humidity: ${
        futureData.daily[i].humidity
      } %</p>
      </div>`);
      $("#fiveDayForecast").append(forecastCard);
      day++
  }
}

/* save local storage function */
function saveCitySearch(currentCity) {
  var citySearchStorage = localStorage.getItem("citySearchStorage");

  if (citySearchStorage) {
    var storedArray = JSON.parse(citySearchStorage);

    if (!storedArray.includes(currentCity)) {
      storedArray.push(currentCity);
      localStorage.setItem("citySearchStorage", JSON.stringify(storedArray));
    }
  } else {
    localStorage.setItem("citySearchStorage", JSON.stringify([currentCity]));
  }
}

/* clear local storage function + event listener */
$("#clearBtn").on("click", function () {
  var localStor = $(this).siblings("#searchHistoryList").text("");
  localStorage.removeItem("citySearchStorage", localStor);
});


currentForecast(cityExample);
loadLocalStorage();

/* event listeners */
searchBtn.on("click", searchCity);
