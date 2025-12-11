import React from 'react';
import ReactConfetti from 'react-confetti';

const Success: React.FC = () => {
  return (
    <>
      <ReactConfetti />
      <div className="selection-container">
        <h2>Muvaffaqiyatli vaqt band qilindi!</h2>
        <p>Sizning uchrashuvingiz tasdiqlandi.</p>
        <p>Biz sizga Telegram orqali tasdiqlash xabarini yubordik.</p>
      </div>
    </>
  );
};

export default Success;
