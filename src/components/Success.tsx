import React from 'react';

const Success: React.FC = () => {
  return (
    <div className="selection-container">
      <h2>✅ Booking Successful!</h2>
      <p>Your appointment has been confirmed.</p>
      <p>We've sent a confirmation message to your Telegram.</p>
    </div>
  );
};

export default Success;
