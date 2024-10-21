import React, { useState, useEffect, useCallback, useRef } from 'react';

const TouchJoystick = ({ onDirectionChange, isPaused }) => {
  const [joystickPos, setJoystickPos] = useState(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const lastDirection = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setJoystickPos({ x: touch.clientX, y: touch.clientY });
    setKnobPos({ x: 0, y: 0 });
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isPaused || !joystickPos) return;

    const touch = e.touches[0];
    const dx = touch.clientX - joystickPos.x;
    const dy = touch.clientY - joystickPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50;

    let newX, newY;
    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      newX = Math.cos(angle) * maxDistance;
      newY = Math.sin(angle) * maxDistance;
    } else {
      newX = dx;
      newY = dy;
    }

    setKnobPos({ x: newX, y: newY });

    // Déterminer la direction
    const threshold = 10;
    let newDirection = { x: 0, y: 0 };
    if (Math.abs(newX) > threshold || Math.abs(newY) > threshold) {
      if (Math.abs(newX) > Math.abs(newY)) {
        newDirection = { x: Math.sign(newX), y: 0 };
      } else {
        newDirection = { x: 0, y: Math.sign(newY) };
      }
    }

    // Appeler onDirectionChange seulement si la direction a changé
    if (newDirection.x !== lastDirection.current.x || newDirection.y !== lastDirection.current.y) {
      lastDirection.current = newDirection;
      onDirectionChange(newDirection);
    }
  }, [isPaused, joystickPos, onDirectionChange]);

  const handleTouchEnd = useCallback(() => {
    setJoystickPos(null);
    setKnobPos({ x: 0, y: 0 });
    lastDirection.current = { x: 0, y: 0 };
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
