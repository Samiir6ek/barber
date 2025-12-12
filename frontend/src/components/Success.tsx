import React from 'react';
import ReactConfetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const Success: React.FC = () => {
  const { width, height } = useWindowSize();
  return (
    <>
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.2}
        origin={{ x: 0, y: 0.5 }} // Pop from left
      />
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.2}
        origin={{ x: 1, y: 0.5 }} // Pop from right
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
