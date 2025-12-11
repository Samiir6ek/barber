import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling
import WheelPicker from 'react-simple-wheel-picker';

// Define the type for the value from react-calendar
type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
  onSelect: (date: Date, time: string) => void;
}

// Mock available time slots for a given date
const mockTimeSlots = [
  { id: '1', value: '09:00' },
  { id: '2', value: '09:30' },
  { id: '3', value: '10:00' },
  { id: '4', value: '10:30' },
  { id: '5', value: '11:00' },
  { id: '6', value: '11:30' },
  { id: '7', value: '14:00' },
  { id: '8', value: '14:30' },
  { id: '9', value: '15:00' },
  { id: '10', value: '15:30' },
  { id: '11', value: '16:00' },
  { id: '12', value: '16:30' }
];

const TimeSelection: React.FC<Props> = ({ onSelect }) => {
  const [date, setDate] = useState<CalendarValue>(new Date());
  const [selectedTime, setSelectedTime] = useState<{ id: string, value: string | number }>(mockTimeSlots[0]);

  const handleDateChange = (newDate: CalendarValue) => {
    setDate(newDate);
  };

  const handleTimeChange = (newTime: { id: string, value: string | number }) => {
    setSelectedTime(newTime);
  };

  const handleConfirmTime = () => {
    if (date instanceof Date && selectedTime) {
      onSelect(date, selectedTime.value);
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
          <div className="wheel-picker-container">
            <WheelPicker
              data={mockTimeSlots}
              onChange={handleTimeChange}
              height={150}
              width={200}
              itemHeight={50}
              selectedID={selectedTime.id}
              color="#EFECE3"
              activeColor="#D2C1B6"
              backgroundColor="#1B3C53"
            />
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
