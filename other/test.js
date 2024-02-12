// // require("dotenv").config();
// // let weather = require('openweather-apis');

// // const ownKey = 'b74fad8bfc8463d25569a1c56b2ad992';

// // weather.setLang('en');
// // weather.setCity('Szekesfehervar');
// // weather.setUnits('metric');
// // weather.setAPPID(ownKey);


// // weather.getWeatherForecastForDays(3, function(err, obj){
// //     console.log(obj);
// // });

// // weather.getSmartJSON(function(err, smart){
// //     console.log(smart);
// // });

// // weather.getAllWeather(function(err, JSONObj){
// //     console.log(JSONObj);
// // });

// const weather = require("openweather-apis");

// const key = 'b74fad8bfc8463d25569a1c56b2ad992';

// let weatherData = {
//     Country: 0,
//     City: 0,
//     Temperature: 0,
//     Humidity: 0,
//     Pressure: 0,
//     WindSpeed: 0,
//     Sunrise: 0,
//     Sunset: 0,
//     Clouds: 0,
//     Description: 0,
// }

// let cpy = {};

// function initWeatherObserver(lang, city, unit)
// {
//     weather.setLang(lang);
//     weather.setCity(city);
//     weather.setUnits(unit);
//     weather.setAPPID(key);
// }

// function getWeatherData()
// {
//     weather.getAllWeather(function(err, JSONObj){
//     console.log(JSONObj);
//     getObj(JSONObj);
//     })
// }

// function getObj(obj)
// {
//     cpy = obj;
// }

// function createWeatherObj(JSONObj)
// {
//     weatherData.Country = JSONObj.sys.country;
//     weatherData.City = JSONObj.name;
//     weatherData.Temperature = JSONObj.main.temp;
//     weatherData.Humidity = JSONObj.main.humidity;
//     weatherData.Pressure  = JSONObj.main.pressure;
//     weatherData.WindSpeed = JSONObj.wind.speed;
//     weatherData.Sunrise = JSONObj.sys.sunrise;
//     weatherData.Sunset = JSONObj.sys.sunset;
//     weatherData.Clouds = JSONObj.clouds.all;
//     weatherData.Description = JSONObj.weather.description;
// }

// initWeatherObserver('en', 'Budapest', 'metric');
// getWeatherData();
// console.log(cpy);

const express = require('express');
const request = require('request');

const app = express();

const key = "b74fad8bfc8463d25569a1c56b2ad992";

app.get('/', (req, res) => {
	let city = req.query.city;
	var request = require('request');
	request(
		`https://samples.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`,
		function(error, response, body) {
			let data = JSON.parse(body);
			if (response.statusCode === 200) {
				res.send(`The weather in your city "${city}" is ${data.list[0].weather[0].description}`);
			}
		}
	);
});

app.listen(3000, () => console.log('Server started on port 3000'));