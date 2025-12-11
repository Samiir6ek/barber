import React from 'react';

interface Barber {
  id: number;
  name: string;
  nickname: string;
  bio: string;
  image_url: string;
}

interface Props {
  barber: Barber;
  onBook: (barber: Barber) => void; // Function to proceed to booking
}

const BarberProfile: React.FC<Props> = ({ barber, onBook }) => {
  return (
    <div className="selection-container">
      <h2>{barber.name}ning profili</h2>
      <div className="barber-profile-details">
        <img src={barber.image_url} alt={barber.name} className="barber-profile-image" />
        <h3>{barber.name} <span className="barber-nickname">"{barber.nickname}"</span></h3>
        <p className="barber-bio">{barber.bio}</p>

        <h4>Eng yaxshi ishlar (Vaqtinchalik)</h4>
        <div className="portfolio-grid">
          {/* Placeholder for 3 best works */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="portfolio-item">
              <img src={barber.image_url} alt={`Best work ${index + 1}`} className="portfolio-image" />
            </div>
          ))}
        </div>
        <button className="confirm-button" onClick={() => onBook(barber)}>
          {barber.name} bilan band qilish
        </button>
      </div>
    </div>
  );
};

export default BarberProfile;
