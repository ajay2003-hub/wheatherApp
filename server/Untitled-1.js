// ...existing imports...
import React, { useState } from "react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    // ...fetch logic...
    // setWeather(data) or setError("Failed to fetch forecast data")
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Only show error or weather after search */}
      {hasSearched && error && <div>{error}</div>}
      {hasSearched && weather && (
        <div>
          {/* ...weather display code... */}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;