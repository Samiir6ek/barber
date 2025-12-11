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
      <h2>4-qadam: Bronni tasdiqlang</h2>
      <div className="confirmation-details">
        <p><strong>Xizmat:</strong> {service?.name}</p>
        <p><strong>Sartarosh:</strong> {barber?.name}</p>
        <p><strong>Sana:</strong> {date?.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Vaqt:</strong> {time}</p>
      </div>
      <button className="confirm-button" onClick={onConfirm}>
        Tasdiqlash va band qilish
      </button>
    </div>
  );
};

export default Confirmation;
