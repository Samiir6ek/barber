import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const works = [
    { src: workImage },
    { src: workImage },
    { src: workImage },
    { src: workImage },
    { src: workImage },
    { src: workImage },
    { src: workImage },
    { src: workImage },
    { src: workImage },
  ];

  const workRows = [
    works.slice(0, 3),
    works.slice(3, 6),
    works.slice(6, 9)
  ];

  const openLightbox = (workIndex: number, angleIndex: number) => {
    setIndex(workIndex * 3 + angleIndex);
    setOpen(true);
  };

  return (
    <>
      <div className="selection-container">
        <h2>{barber.name}ning profili</h2>
        <div className="barber-profile-details">
          <img src={barber.image_url} alt={barber.name} className="barber-profile-image" />
          <h3>{barber.name} <span className="barber-nickname">"{barber.nickname}"</span></h3>
          <p className="barber-bio">{barber.bio}</p>

          <h4>Eng yaxshi ishlar</h4>
          <div className="works-container">
            {workRows.map((row, workIndex) => (
              <div key={workIndex} className="work-row">
                <div className="portfolio-grid">
                  {row.map((work, angleIndex) => (
                    <div key={angleIndex} className="portfolio-item" onClick={() => openLightbox(workIndex, angleIndex)}>
                      <img src={work.src} alt={`Work ${workIndex + 1} - Angle ${angleIndex + 1}`} className="portfolio-image" />
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

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={works}
        index={index}
      />
    </>
  );
};

export default BarberProfile;
