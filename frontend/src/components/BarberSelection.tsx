import React from 'react';

interface Barber {
  id: number;
  name: string;
  nickname: string;
  bio: string;
  image_url: string; // Added image_url
}

interface Props {
  barbers: Barber[];
  onViewProfile: (barber: Barber) => void; // Changed prop name
}

const BarberSelection: React.FC<Props> = ({ barbers, onViewProfile }) => {
  return (
    <div className="selection-container">
      <h2>2-qadam: Sartaroshni tanlang</h2>
      <div className="card-grid">
        {barbers.map(barber => (
          <div key={barber.id} className="barber-card" onClick={() => onViewProfile(barber)}>
            <img src={barber.image_url} alt={barber.name} className="barber-image" />
            <h3>{barber.name}</h3>
            <p className="barber-nickname"><em>"{barber.nickname}"</em></p>
            <p className="barber-bio-short">{barber.bio.substring(0, 50)}...</p> {/* Short bio preview */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;
