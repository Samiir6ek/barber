import React from 'react';

interface Barber {
  id: number;
  name: string;
  nickname: string;
  bio: string;
}

interface Props {
  barbers: Barber[];
  onSelect: (barber: Barber) => void;
}

const BarberSelection: React.FC<Props> = ({ barbers, onSelect }) => {
  return (
    <div className="selection-container">
      <h2>Step 2: Choose a Barber</h2>
      <div className="card-grid">
        {barbers.map(barber => (
          <div key={barber.id} className="card" onClick={() => onSelect(barber)}>
            <h3>{barber.name}</h3>
            <p><em>"{barber.nickname}"</em></p>
            <p>{barber.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;
