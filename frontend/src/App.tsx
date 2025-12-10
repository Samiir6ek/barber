import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import components
import ServiceSelection from './components/ServiceSelection';
import BarberSelection from './components/BarberSelection';
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
}

// --- API Configuration ---
const API_BASE_URL = 'https://barber-qp73.onrender.com'; // We will replace this later

const api = axios.create({
  baseURL: API_BASE_URL,
});


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
      { id: 1, name: 'Standard Cut', duration_minutes: 30 },
      { id: 2, name: 'Beard Trim', duration_minutes: 30 },
      { id: 3, name: 'Full Service', duration_minutes: 60 },
    ];
    const mockBarbers: Barber[] = [
      { id: 1, name: 'Alex', nickname: 'The Precisionist', bio: 'Loves clean lines and sharp fades.' },
      { id: 2, name: 'John', nickname: 'The Classic', bio: 'Specializes in classic cuts and traditional styles.' },
      { id: 3, name: 'Mike', nickname: 'The Trendsetter', bio: 'Always up to date with the latest styles.' },
    ];
    setServices(mockServices);
    setBarbers(mockBarbers);
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceSelection services={services} onSelect={handleServiceSelect} />;
      case 2:
        return <BarberSelection barbers={barbers} onSelect={handleBarberSelect} />;
      case 3:
        return <TimeSelection onSelect={handleTimeSelect} />;
      case 4:
        return <Confirmation 
                  service={selectedService} 
                  barber={selectedBarber} 
                  date={selectedDate} 
                  time={selectedTime}
                  onConfirm={handleConfirm} 
                />;
      case 5:
        return <Success />;
      default:
        return <div>Loading...</div>;
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setStep(3);
  };
  
  const handleTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(4);
  };

  const handleConfirm = () => {
    // Here we would make the API call to book the appointment
    console.log('Booking confirmed:', { selectedService, selectedBarber, selectedDate, selectedTime });
    setStep(5);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Book Your Appointment</h1>
        <p>Step {step} of 5</p>
      </header>
      <main>
        {renderStep()}
      </main>
    </div>
  );
}

export default App;
