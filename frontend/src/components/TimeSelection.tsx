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
  { time: '09:00', status: 'Open' },
  { time: '09:30', status: 'Booked' },
  { time: '10:00', status: 'Open' },
  { time: '10:30', status: 'Open' },
  { time: '11:00', status: 'Booked' },
  { time: '11:30', status: 'Open' },
  { time: '14:00', status: 'Open' },
  { time: '14:30', status: 'Booked' },
  { time: '15:00', status: 'Open' },
  { time: '15:30', status: 'Open' },
  { time: '16:00', status: 'Booked' },
  { time: '16:30', status: 'Open' }
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
      <h2>3-qadam: Sana va vaqtni tanlang</h2>
      <div className="time-selection-layout">
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
            minDate={new Date()} // Prevent selecting past dates
          />
        </div>
        <div className="time-slots-container">
          <h3>{date instanceof Date ? date.toLocaleDateString() : ''} uchun mavjud vaqtlar</h3>
          <ul className="time-slots-list">
            {mockTimeSlots.map((slot) => (
              <li key={slot.time}>
                <button
                  className={`time-slot-button ${slot.status === 'Booked' ? 'booked' : 'open'} ${selectedTime === slot.time ? 'selected' : ''}`}
                  onClick={() => slot.status === 'Open' && handleTimeSelect(slot.time)}
                  disabled={slot.status === 'Booked'}
                >
                  <span className="time-slot-time">{slot.time}</span>
                  <span className="time-slot-status">{slot.status === 'Open' ? 'Ochiq' : 'Band'}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
