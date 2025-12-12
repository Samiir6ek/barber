import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

const Success: React.FC = () => {
  return (
    <>
      <ConfettiExplosion />
      <div className="selection-container">
        <h2>🎉 Muvaffaqiyatli vaqt band qilindi! 🎉</h2>
        <p>Sizning uchrashuvingiz tasdiqlandi.</p>
        <p>Biz sizga Telegram orqali tasdiqlash xabarini yubordik.</p>
      </div>
    </>
  );
};

export default Success;
