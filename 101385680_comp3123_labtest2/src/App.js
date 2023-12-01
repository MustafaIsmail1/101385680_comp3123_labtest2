import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './101385680_comp3123_labtest2.css';

const WeatherApp = () => {
  const [city, setCity] = useState('Toronto');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = '80e31d6814358bfcec2dc281323b01c4';

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
      .then((response) => setWeatherData(response.data))
      .catch((error) => console.error('Error fetching weather data:', error));
  }, [city, apiKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newCity = e.target.elements.city.value;
    if (newCity) {
      setCity(newCity);
    }
  };

  const getCurrentDayData = () => {
    if (!weatherData || !weatherData.list) return null;

    const currentDate = new Date().toLocaleDateString();
    const currentDayData = weatherData.list.find(
      (forecast) => new Date(forecast.dt * 1000).toLocaleDateString() === currentDate
    );

    return currentDayData;
  };

  const getWeeklyForecast = () => {
    if (!weatherData || !weatherData.list) return null;

    const dailyForecasts = {};
    let daysCount = 0;

    weatherData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const currentDay = new Date();
      const isCurrentDay = date.getDate() === currentDay.getDate() && date.getMonth() === currentDay.getMonth();

      if (!isCurrentDay && daysCount < 7) {
        const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        const formattedDate = `${dayOfWeek}, ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;

        if (!dailyForecasts[formattedDate]) {
          dailyForecasts[formattedDate] = {
            minTemp: forecast.main.temp_min,
            maxTemp: forecast.main.temp_max,
            icon: forecast.weather[0].icon,
          };
          daysCount++;
        }
      }
    });

    return dailyForecasts;
  };

  const currentDayData = getCurrentDayData();
  const weeklyForecast = getWeeklyForecast();

  return (
    <div className="weather-app">
       <form onSubmit={handleSearch} className="search-bar">
        <input type="text" name="city" placeholder="Enter city name" />
        <button type="submit">Change City</button>
      </form>
      <header>
        <h1>101385680 - Mustafa Ismail - Weather App</h1>
      </header>
      {currentDayData && (
        <div className="current-weather">
          <h2>{city} Weather - {currentDayData.weather[0].description}</h2>
          <p>Temperature: {currentDayData.main.temp.toFixed(1)} °C</p>
          <p>Max Temperature: {currentDayData.main.temp_max.toFixed(1)} °C</p>
          <p>Min Temperature: {currentDayData.main.temp_min.toFixed(1)} °C</p>
          <p>Humidity: {currentDayData.main.humidity}%</p>
          <p>Wind Speed: {currentDayData.wind.speed} m/s</p>
          <p>Clear: {currentDayData.weather[0].main === 'Clear' ? 'Yes' : 'No'}</p>
          <img
            src={`http://openweathermap.org/img/wn/${currentDayData.weather[0].icon}.png`}
            alt="Weather Icon"
          />
        </div>
      )}
      {weeklyForecast && (
        <div className="weekly-forecast-title">
          <h2>Weekly Forecast</h2>
        </div>
      )}
      {weeklyForecast && (
        <div className="weekly-forecast">
          {Object.entries(weeklyForecast).map(([date, { minTemp, maxTemp, icon }]) => (
            <div key={date}>
              <p>{date}</p>
              <p>Max Temperature: {maxTemp.toFixed(1)} °C</p>
              <p>Min Temperature: {minTemp.toFixed(1)} °C</p>
              <img
                src={`http://openweathermap.org/img/wn/${icon}.png`}
                alt="Weather Icon"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
