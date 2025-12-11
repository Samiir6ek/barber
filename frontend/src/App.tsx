import { useState, useEffect } from 'react';
import './App.css';
// Import components
import ServiceSelection from './components/ServiceSelection';
import BarberSelection from './components/BarberSelection';
import BarberProfile from './components/BarberProfile'; // Import BarberProfile
import TimeSelection from './components/TimeSelection';
import Confirmation from './components/Confirmation';
import Success from './components/Success';

// --- Mock Data and Types (will be replaced by API calls) ---
export interface Service {
  id: number;
  name: string;
  duration_minutes: number;
}

export interface Barber {
  id: number;
  name: string;
  nickname: string;
  bio: string;
  image_url: string; // New field for barber's photo
}

// --- API Configuration ---
// We will use an environment variable for the API URL
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });


// --- Main App Component ---
function App() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // --- Fetch initial data ---
  useEffect(() => {
    // In a real app, we'd fetch services and barbers from our API
    // For now, we'll use mock data to build the UI
    const mockServices: Service[] = [
      { id: 1, name: 'Standart soch kesish', duration_minutes: 30 },
      { id: 2, name: 'Soqol olish', duration_minutes: 30 },
      { id: 3, name: 'Toʻliq xizmat', duration_minutes: 60 },
    ];
    const mockBarbers: Barber[] = [
      { id: 1, name: 'Aleksandr', nickname: 'Aniqchi', bio: 'Toza chiziqlar va oʻtkir oʻtishlarni yaxshi koʻradi.', image_url: '/src/assets/images/barber.jpg' },
      { id: 2, name: 'Javohir', nickname: 'Klassik', bio: 'Klassik soch turmagi va anʼanaviy uslublarga ixtisoslashgan.', image_url: '/src/assets/images/barber.jpg' },
      { id: 3, name: 'Mayk', nickname: 'Trendsetter', bio: 'Har doim eng soʻnggi uslublardan xabardor.', image_url: '/src/assets/images/barber.jpg' },
    ];
    setServices(mockServices);
    setBarbers(mockBarbers);
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceSelection services={services} onSelect={handleServiceSelect} />;
      case 2:
        return <BarberSelection barbers={barbers} onViewProfile={handleViewBarberProfile} />; {/* Corrected prop name */}
      case 3:
        return selectedBarber && <BarberProfile barber={selectedBarber} onBook={handleBarberSelect} />; {/* New step for BarberProfile */}
      case 4:
        return <TimeSelection onSelect={handleTimeSelect} />;
      case 5:
        return <Confirmation 
                  service={selectedService} 
                  barber={selectedBarber} 
                  date={selectedDate} 
                  time={selectedTime}
                  onConfirm={handleConfirm} 
                />;
      case 6:
        return <Success />;
      default:
        return <div>Loading...</div>;
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleViewBarberProfile = (barber: Barber) => { {/* New handler for viewing profile */}
    setSelectedBarber(barber);
    setStep(3); // Go to BarberProfile step
  };

  const handleBarberSelect = (barber: Barber) => { {/* Modified handler to proceed to time selection */}
    setSelectedBarber(barber); // Ensure barber is set if coming from profile
    setStep(4); // Go to TimeSelection step
  };
  
  const handleTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(5);
  };

  const handleConfirm = () => {
    // Here we would make the API call to book the appointment
    console.log('Booking confirmed:', { selectedService, selectedBarber, selectedDate, selectedTime });
    setStep(6);
  };

  return (
    <div className="App">
      <header className="App-header">
        {step > 1 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            &larr; Back
          </button>
        )}
        <h1>Uchrashuvni bron qilish</h1>
        <p>{step} / 6 qadam</p> {/* Updated total steps */}
      </header>
      <main>
        {renderStep()}
      </main>
    </div>
  );
}

export default App;