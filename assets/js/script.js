/* variables */
var apiKey = "5272f2f8906b594a33bc1da3553899cf"; 
var url = "https://api.openweathermap.org/data/2.5/onecall?";
var lat = "";
var lon = "";
var exclude = "exclude=minutely,hourly,alerts";
var units = "imperial"
var currentDate = moment().format('LL');
var searchBtn = $("#searchBtn");