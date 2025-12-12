import React from 'react';
import ReactConfetti from 'react-confetti';

// Success component with confetti effect
const Success: React.FC = () => {
  return (
    <>
      <ReactConfetti
        numberOfPieces={200}
        initialVelocityX={{ min: -10, max: 10 }}
        initialVelocityY={{ min: -20, max: 5 }}
      />
      <div className="selection-container">
        <h2>🎉 Muvaffaqiyatli vaqt band qilindi! 🎉</h2>
        <p>Sizning uchrashuvingiz tasdiqlandi.</p>
        <p>Biz sizga Telegram orqali tasdiqlash xabarini yubordik.</p>
      </div>
    </>
  );
};

export default Success;
