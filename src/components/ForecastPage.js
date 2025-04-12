import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./ForecastPage.css";


const ForecastPage = ({ forecast }) => {
  const formattedData = forecast.map((day) => ({
    date: new Date(day.dt_txt).toLocaleDateString(),
    temp: day.main.temp,
  }));

  return (
    <div className="forecast-container">
      <h2>5-Day Forecast</h2>
      <div className="forecast-content">
        <div className="forecast-list">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
              <p>Temp: {day.main.temp}°C</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>

        <div className="graph-wrapper">
          <div className="graph-container">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#4caf50" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="forecast-timeline">
            {forecast.map((day, index) => (
              <div key={index} className="timeline-item">
                <p>{new Date(day.dt_txt).toLocaleDateString().split(',')[0]}</p>
                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} />
                <p>{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;