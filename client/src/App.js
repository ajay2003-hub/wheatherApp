import React, { useState } from 'react';
import { WiDayCloudy, WiDaySunny, WiDayRain, WiDayThunderstorm } from 'react-icons/wi';

const forecastIcons = {
  thunder: WiDayThunderstorm,
  cloudy: WiDayCloudy,
  rain: WiDayRain,
  sunny: WiDaySunny,
};

function getIconKey(main) {
  switch (main.toLowerCase()) {
    case 'thunderstorm': return 'thunder';
    case 'rain': return 'rain';
    case 'clear': return 'sunny';
    case 'clouds': return 'cloudy';
    default: return 'cloudy';
  }
}

function WeatherApp() {
  const [searchCity, setSearchCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setWeather(null);
    setForecast([]);
    setError('');
    setLoading(true);
    try {
      // Fetch current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=ee97498601a177f693093e29e0a18729&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather({
        city: data.name,
        temp: data.main.temp,
        min: data.main.temp_min,
        max: data.main.temp_max,
        desc: data.weather[0].description,
        icon: getIconKey(data.weather[0].main),
      });

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=ee97498601a177f693093e29e0a18729&units=metric`
      );
      if (!forecastRes.ok) throw new Error('Forecast not found');
      const forecastData = await forecastRes.json();
      // Take one forecast per day (every 8th item, as data is every 3 hours)
      const daily = forecastData.list.filter((item, idx) => idx % 8 === 0).slice(0, 5);
      setForecast(
        daily.map(item => ({
          day: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
          icon: getIconKey(item.weather[0].main),
          temp: `${Math.round(item.main.temp_max)}/${Math.round(item.main.temp_min)}`,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #4e54c8 0%, #8f94fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <form onSubmit={handleSearch} className="weather-form" style={{ marginBottom: 32 }}>
        <input
          type="text"
          value={searchCity}
          onChange={e => setSearchCity(e.target.value)}
          placeholder="Enter city"
          className="weather-input"
        />
        <button type="submit" className="weather-btn">Search</button>
      </form>
      {loading && <div style={{ color: '#fff', marginBottom: 16 }}>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {weather && (
        <div className="weather-container">
          <h2 style={{ fontWeight: 400, fontSize: 28 }}>{weather.city}</h2>
          {(() => {
            const Icon = forecastIcons[weather.icon];
            return typeof Icon === 'function'
              ? <Icon className="weather-main-icon" />
              : <WiDaySunny className="weather-main-icon" />;
          })()}
          <div className="weather-temp">{Math.round(weather.temp)}°C</div>
          <div className="weather-range">{Math.round(weather.min)}°{'    '}{Math.round(weather.max)}°</div>
          <div className="weather-desc">{weather.desc}</div>
        </div>
      )}
      {forecast.length > 0 && (
        <div className="weather-forecast">
          {forecast.map((f, i) => {
            const Icon = forecastIcons[f.icon];
            return (
              <div className="weather-forecast-day" key={i}>
                <div>{f.day}</div>
                {typeof Icon === 'function'
                  ? <Icon className="weather-forecast-icon" />
                  : <WiDaySunny className="weather-forecast-icon" />}
                <div>{f.temp}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;