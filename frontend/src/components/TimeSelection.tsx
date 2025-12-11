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
  const [selectedTime, setSelectedTime] = useState<string>(mockTimeSlots[0].time); // Default to the first open time

  const handleDateChange = (newDate: CalendarValue) => {
    setDate(newDate);
    // Reset time selection when date changes, find first available
    const firstOpenSlot = mockTimeSlots.find(slot => slot.status === 'Open');
    setSelectedTime(firstOpenSlot ? firstOpenSlot.time : '');
  };

  const handleConfirmTime = () => {
    if (date instanceof Date && selectedTime) {
      onSelect(date, selectedTime);
    }
  };

  return (
    <div className="selection-container">
      <h2>4-qadam: Sana va vaqtni tanlang</h2>
      <div className="time-selection-layout">
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
            minDate={new Date()} // Prevent selecting past dates
          />
        </div>
        <div className="time-slots-container">
          <h3>Mavjud vaqtlar</h3>
          <div className="roller-container">
            <div className="roller-selection-indicator"></div>
            <ul className="roller">
              {mockTimeSlots.map((slot) => (
                <li
                  key={slot.time}
                  className={`roller-item ${slot.status === 'Booked' ? 'booked' : ''}`}
                >
                  {slot.time}
                </li>
              ))}
            </ul>
          </div>
          <button className="confirm-button" onClick={handleConfirmTime} disabled={!selectedTime}>
            Tanlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
