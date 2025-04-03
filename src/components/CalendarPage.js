import React, { useState } from 'react';
import './CalendarPage.css';

const CalendarPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(0); // January = 0
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    startDate: '',
    endDate: '',
    color: '#4CAF50'
  });

  // Define farm events with date ranges
  const farmEvents = [
    {
      id: 1,
      name: "Lambing Season",
      startDate: new Date(2025, 1, 15), // February 15
      endDate: new Date(2025, 2, 31),   // March 31
      color: "#ff9800",
      textColor: "#fff"
    },
    {
      id: 2,
      name: "Calving Season",
      startDate: new Date(2025, 3, 1),  // April 1
      endDate: new Date(2025, 4, 15),   // May 15
      color: "#2196f3",
      textColor: "#fff"
    },
    {
      id: 3,
      name: "Slurry Spreading",
      startDate: new Date(2025, 2, 20),  
      endDate: new Date(2025, 3, 10), 
      color: "#9c27b0",

    }
    
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  const firstDayOfMonth2025 = [3, 6, 6, 2, 4, 0, 2, 5, 1, 3, 6, 1];

  
  const getEventsForDate = (day) => {
    const currentDate = new Date(2025, selectedMonth, day);
    return farmEvents.filter(event => 
      currentDate >= event.startDate && currentDate <= event.endDate
    );
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth[selectedMonth];
    const firstDay = firstDayOfMonth2025[selectedMonth];

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    
    for (let day = 1; day <= totalDays; day++) {
      const eventsForDay = getEventsForDate(day);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${eventsForDay.length > 0 ? 'has-events' : ''}`}
        >
          <span className="day-number">{day}</span>
          {eventsForDay.map(event => (
            <div
              key={event.id}
              className="event-indicator"
              style={{
                backgroundColor: event.color,
                color: event.textColor
              }}
              title={event.name}
            >
              {event.name}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const handleAddEvent = () => {
    // Implementation of adding a new event
    console.log("Adding new event:", newEvent);
    setShowEventForm(false);
  };

  return (
    <div className="calendar-container">
      <h2>2025 Farm Calendar</h2>
      
      <div className="event-legend">
        {farmEvents.map(event => (
          <div key={event.id} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: event.color }}
            ></div>
            <span>{event.name}</span>
          </div>
        ))}
      </div>

      <div className="month-selector">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(index)}
            className={`month-button ${selectedMonth === index ? 'active' : ''}`}
          >
            {month}
          </button>
        ))}
      </div>

      <button 
        className="add-event-button" 
        onClick={() => setShowEventForm(true)}
      >
        Add New Event
      </button>

      {showEventForm && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h3>Add New Farm Event</h3>
            <input
              type="text"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
            />
            <input
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
            />
            <input
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
            />
            <input
              type="color"
              value={newEvent.color}
              onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
            />
            <div className="form-buttons">
              <button onClick={() => setShowEventForm(false)}>Cancel</button>
              <button onClick={handleAddEvent}>Add Event</button>
            </div>
          </div>
        </div>
      )}

      <div className="calendar">
        <h3>{months[selectedMonth]} 2025</h3>
        <div className="calendar-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-grid">
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 