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
      <h2>{barber.name}'s Profile</h2>
      <div className="barber-profile-details">
        <img src={barber.image_url} alt={barber.name} className="barber-profile-image" />
        <h3>{barber.name} <span className="barber-nickname">"{barber.nickname}"</span></h3>
        <p className="barber-bio">{barber.bio}</p>

        <h4>Best Works (Placeholder)</h4>
        <div className="portfolio-grid">
          {/* Placeholder for 10 "before and after" image pairs */}
          {[...Array(3)].map((_, index) => ( // Show 3 placeholder works
            <div key={index} className="portfolio-item">
              <img src={barber.image_url} alt="Before" className="portfolio-image" />
              <img src={barber.image_url} alt="After" className="portfolio-image" />
            </div>
          ))}
        </div>
        <button className="confirm-button" onClick={() => onBook(barber)}>
          Book with {barber.name}
        </button>
      </div>
    </div>
  );
};

export default BarberProfile;
