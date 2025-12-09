import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling

// Define the type for the value from react-calendar
type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
  onSelect: (date: Date, time: string) => void;
}

// Mock available time slots for a given date
const mockTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const TimeSelection: React.FC<Props> = ({ onSelect }) => {
  const [date, setDate] = useState<CalendarValue>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateChange = (newDate: CalendarValue) => {
    setDate(newDate);
    setSelectedTime(null); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // We have both date and time, so we can proceed
    if (date instanceof Date) {
      onSelect(date, time);
    }
  };

  return (
    <div className="selection-container">
      <h2>Step 3: Choose a Date & Time</h2>
      <div className="time-selection-layout">
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
            minDate={new Date()} // Prevent selecting past dates
          />
        </div>
        <div className="time-slots-container">
          <h3>Available Times for {date instanceof Date ? date.toLocaleDateString() : ''}</h3>
          <div className="time-slots-grid">
            {mockTimeSlots.map(time => (
              <button
                key={time}
                className={`time-slot-button ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;