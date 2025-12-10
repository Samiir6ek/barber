import React from 'react';

interface Service {
  id: number;
  name: string;
  duration_minutes: number;
}

interface Barber {
  id: number;
  name: string;
  nickname: string;
  bio: string;
}

interface Props {
  service: Service | null;
  barber: Barber | null;
  date: Date | null;
  time: string | null;
  onConfirm: () => void;
}

const Confirmation: React.FC<Props> = ({ service, barber, date, time, onConfirm }) => {
  return (
    <div className="selection-container">
      <h2>Step 4: Confirm Your Booking</h2>
      <div className="confirmation-details">
        <p><strong>Service:</strong> {service?.name}</p>
        <p><strong>Barber:</strong> {barber?.name}</p>
        <p><strong>Date:</strong> {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Time:</strong> {time}</p>
      </div>
      <button className="confirm-button" onClick={onConfirm}>
        Confirm & Book
      </button>
    </div>
  );
};

export default Confirmation;
