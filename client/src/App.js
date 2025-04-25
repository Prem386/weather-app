import React, { useState } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherApp = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = (city) => {
    const url = `http://localhost:5000/api/weather?city=${city}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      });
  };

  const fetchForecastData = (city) => {
    const url = `http://localhost:5000/api/forecast?city=${city}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => setForecastData(data.list || []))
      .catch((error) => {
        console.error('Error fetching forecast data:', error);
      });
  };

  const handleSearch = () => {
    if (location) {
      setLoading(true);
      fetchWeatherData(location);
      fetchForecastData(location);
    }
  };

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="text-white">WeatherApp</h2>
        </div>
        <div className="search-bar">
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter City Name"
          />
          <button className="btn btn-primary mt-2" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="text-center text-white">Loading...</div>}

      {/* Weather Info Section */}
      {weatherData && !loading && (
        <div className="weather-card mt-4">
          <h3 className="text-center">{weatherData?.name}</h3>
          <div className="text-center">
            <h4 className="text-uppercase">{weatherData?.weather?.[0]?.description}</h4>
            <div className="temp">{weatherData?.main?.temp}°C</div>
            <p>Feels Like: {weatherData?.main?.feels_like}°C</p>
            <p><strong>Min Temperature:</strong> {weatherData?.main?.temp_min}°C</p>
            <p><strong>Max Temperature:</strong> {weatherData?.main?.temp_max}°C</p>
          </div>
          <div className="d-flex justify-content-center">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}.png`}
              alt="Weather Icon"
              style={{ height: '100px', width: '100px' }}
            />
          </div>
        </div>
      )}

      {/* 5-Day Forecast Section */}
      {forecastData.length > 0 && !loading && (
        <div className="row mt-4" id="forecast-section">
          {forecastData.map((forecast, index) => {
            if (index % 8 === 0) {
              return (
                <div className="col-2" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <h5>{new Date(forecast.dt_txt).toLocaleDateString()}</h5>
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.weather[0]?.icon}.png`}
                        alt="Forecast Icon"
                        style={{ height: '50px', width: '50px' }}
                      />
                      <p>{forecast.main?.temp}°C</p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Additional Information Section */}
      {weatherData && (
        <div className="weather-card mt-4">
          <h4>Additional Information</h4>
          <div className="d-flex justify-content-between">
            <p><strong>Humidity:</strong> {weatherData?.main?.humidity}%</p>
            <p><strong>Wind:</strong> {weatherData?.wind?.speed} m/s</p>
          </div>
          <div className="d-flex justify-content-between">
            <p><strong>UV Index:</strong> --</p>
            <p><strong>Air Quality:</strong> --</p>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default WeatherApp;
