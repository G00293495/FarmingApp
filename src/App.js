import React, { useState, useEffect, useContext, memo } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MapComponent from "./components/MapComponents";
import { ThemeProvider, ThemeContext } from "./components/ThemeContext";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import InventoryPage from "./components/InventoryPage";
import ForecastPage from "./components/ForecastPage";
import CostIncomePage from "./components/CostIncomePage"; 
import CameraComponent from "./components/CameraComponent"; 
import CatalogPage from "./components/CatalogPage"; 
import CalendarPage from './components/CalendarPage';
import "./App.css";


const FieldPage = ({ fieldName, imageUrl }) => (
  <div className="section">
    <h2>{fieldName}</h2>
    <p>This is a detailed page for {fieldName}.</p>
    {imageUrl && <img src={imageUrl} alt={`${fieldName} illustration`} className="field-image" />}
  </div>
);

// Memoize the MapWithNavigation component - prevent unnecessary re-renders
const MapWithNavigation = memo(() => {
  const navigate = useNavigate();
  return <MapComponent navigate={navigate} />;
});

const AppContent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, logout } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activityInput, setActivityInput] = useState("");
  const [weather, setWeather] = useState({ temp: 0, condition: "Loading..." });
  const [forecast, setForecast] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/activities", { 
        timeout: 5000 // 5 second timeout
      });
      setActivities(response.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error("Activities request timed out");
      } else {
        console.error("Error fetching activities", error);
      }
    }
  };

  const fetchWeather = async () => {
    try {
      console.log("Fetching weather with API key:", process.env.REACT_APP_WEATHER_API_KEY);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
        { timeout: 5000 } // 5 second timeout
      );
      setWeather({
        temp: response.data.main.temp,
        condition: response.data.weather[0].description,
      });
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error("Weather request timed out");
        setWeather({ temp: '--', condition: "Unavailable (timeout)" });
      } else {
        console.error("Error fetching weather", error);
        setWeather({ temp: '--', condition: "Unavailable" });
      }
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Dublin,IE&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
        { timeout: 5000 } // 5 second timeout
      );
      const dailyForecast = response.data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
      setForecast(dailyForecast);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error("Forecast request timed out");
      } else {
        console.error("Error fetching forecast", error);
      }
      setForecast([]);
    }
  };

  // Create a stable function reference for handling activity input
  const handleActivityInputChange = (e) => {
    setActivityInput(e.target.value);
  };

  const handleAddActivity = async (e) => {
    e.preventDefault(); 
    if (activityInput.trim()) {
      try {
        const response = await axios.post("http://localhost:5000/activities", {
          activity: activityInput,
        }, { 
          timeout: 5000 // 5 second timeout
        });
        setActivities([...activities, response.data]);
        setActivityInput("");
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          console.error("Add activity request timed out");
        } else {
          console.error("Error adding activity", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchWeather();
    fetchForecast();
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <header>
          <h1>FarmPulse</h1>
          <p>The Ultimate App For Farmers around Ireland</p>
          <nav className="nav-bar">
            <button onClick={() => window.location.href = "/"} className="nav-button">Home</button>
            <button onClick={() => window.location.href = "/forecast"} className="nav-button">5-Day Forecast</button>
            <button onClick={() => window.location.href = "/inventory"} className="nav-button">Inventory</button>
            <button onClick={() => window.location.href = "/camera"} className="nav-button">Camera</button>
            <button onClick={() => window.location.href = "/cost-income"} className="nav-button">Cost & Income</button>
            <button onClick={() => window.location.href = "/catalog"} className="nav-button">Catalog</button>
            <button onClick={() => window.location.href = "/calendar"} className="nav-button">Calendar</button>
            <button onClick={toggleTheme} className="nav-button">Toggle Theme</button>
            <button onClick={logout} className="nav-button">Logout</button>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <section className="map-section">
                  <MapWithNavigation />
                </section>
                <div className={`right-side ${theme}`}>
                  <section className="section weather-section">
                    <h2>Current Weather</h2>
                    <p>Temperature: {weather.temp}°C</p>
                    <p>Condition: {weather.condition}</p>
                    <button onClick={fetchWeather} className="weather-btn">Refresh Weather</button>
                  </section>
                  <section className="section activity-section">
                    <h2>Activity Feed</h2>
                    <form onSubmit={handleAddActivity}>
                      <input
                        type="text"
                        placeholder="Enter activity..."
                        value={activityInput}
                        onChange={handleActivityInputChange}
                        className="activity-input"
                      />
                      <button type="submit" className="add-activity-btn">Add Activity</button>
                    </form>
                    <ul className="activity-list">
                      {activities.map((activity, index) => (
                        <li key={index}>
                          {activity.activity} <small>({new Date(activity.timestamp).toLocaleString()})</small>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </>
            } />
            <Route path="/forecast" element={<ForecastPage forecast={forecast} />} />
            <Route path="/field1" element={<FieldPage fieldName="Field 1" imageUrl="/field1.jpg" />} />
            <Route path="/field2" element={<FieldPage fieldName="Field 2" imageUrl="/field2.png" />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/camera" element={<CameraComponent />} />
            <Route path="/cost-income" element={<CostIncomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
