import React from 'react';
import workImage from '/src/assets/images/work.jpg'; // Import the work image

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
  const works = [1, 2, 3]; // 3 best works
  const angles = [1, 2, 3]; // 3 angles per work

  return (
    <div className="selection-container">
      <h2>{barber.name}ning profili</h2>
      <div className="barber-profile-details">
        <img src={barber.image_url} alt={barber.name} className="barber-profile-image" />
        <h3>{barber.name} <span className="barber-nickname">"{barber.nickname}"</span></h3>
        <p className="barber-bio">{barber.bio}</p>

        <h4>Eng yaxshi ishlar</h4>
        <div className="works-container">
          {works.map(workIndex => (
            <div key={workIndex} className="work-row">
              <div className="portfolio-grid">
                {angles.map(angleIndex => (
                  <div key={angleIndex} className="portfolio-item">
                    <img src={workImage} alt={`Work ${workIndex} - Angle ${angleIndex}`} className="portfolio-image" />
                  </div>
                ))}
              </div>
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
