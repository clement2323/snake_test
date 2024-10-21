import React, { useState, useEffect, useCallback } from 'react';

const TouchJoystick = ({ onDirectionChange, isPaused }) => {
  const [joystickPos, setJoystickPos] = useState(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setJoystickPos({ x: touch.clientX, y: touch.clientY });
    setKnobPos({ x: 0, y: 0 });
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isPaused) return; // Ne pas réagir aux mouvements si le jeu est en pause

    if (!joystickPos) return;

    const touch = e.touches[0];
    const dx = touch.clientX - joystickPos.x;
    const dy = touch.clientY - joystickPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50; // Rayon maximum du joystick

    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      const newX = Math.cos(angle) * maxDistance;
      const newY = Math.sin(angle) * maxDistance;
      setKnobPos({ x: newX, y: newY });
    } else {
      setKnobPos({ x: dx, y: dy });
    }

    // Déterminer la direction
    const threshold = 20; // Seuil pour considérer un mouvement
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      onDirectionChange({ x: Math.sign(dx), y: 0 });
    } else if (Math.abs(dy) > threshold) {
      onDirectionChange({ x: 0, y: Math.sign(dy) });
    }
  }, [isPaused, joystickPos, onDirectionChange]);

  const handleTouchEnd = useCallback(() => {
    setJoystickPos(null);
    setKnobPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  if (!joystickPos) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: joystickPos.x - 50,
        top: joystickPos.y - 50,
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 50 + knobPos.x - 25,
          top: 50 + knobPos.y - 25,
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
      />
    </div>
  );
};

export default TouchJoystick;
