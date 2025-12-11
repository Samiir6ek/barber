import React from 'react';

interface Service {
  id: number;
  name: string;
  duration_minutes: number;
}

interface Props {
  services: Service[];
  onSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<Props> = ({ services, onSelect }) => {
  return (
    <div className="selection-container">
      <h2>1-qadam: Xizmatni tanlang</h2>
      <div className="card-grid">
        {services.map(service => (
          <div key={service.id} className="card" onClick={() => onSelect(service)}>
            <h3>{service.name}</h3>
            <p>{service.duration_minutes} daqiqa</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
