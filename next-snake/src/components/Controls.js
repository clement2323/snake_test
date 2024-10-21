import { useState, useEffect } from 'react';

export default function Controls({ onDirectionChange }) {
  const [canVibrate, setCanVibrate] = useState(false);

  useEffect(() => {
    setCanVibrate('vibrate' in navigator);
  }, []);

  const handleInteraction = (direction) => (e) => {
    if (e.type === 'touchend') {
      e.preventDefault();
    }
    onDirectionChange(direction);
    if (canVibrate) {
      navigator.vibrate(50); // Vibration courte de 50ms
    }
  };

  const buttonClass = `
    w-full h-full bg-black text-white rounded-full border-2 border-white 
    shadow-[0_0_0_2px_#000] hover:bg-gray-800 focus:outline-none 
    flex items-center justify-center transition-all duration-150 ease-in-out
    hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.7)] active:shadow-[0_0_15px_5px_rgba(255,255,255,0.9)]
  `;

  return (
    <div className="w-2/3 aspect-square grid grid-cols-3 grid-rows-3 gap-2 mx-auto">
      <div className="col-start-2 row-start-1">
        <button 
          onClick={handleInteraction({ x: 0, y: -1 })}
          onTouchEnd={handleInteraction({ x: 0, y: -1 })}
          className={buttonClass}
          aria-label="Up"
        >
          <span className="text-[min(4vw,4vh)]">▲</span>
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button 
          onClick={handleInteraction({ x: -1, y: 0 })}
          onTouchEnd={handleInteraction({ x: -1, y: 0 })}
          className={buttonClass}
          aria-label="Left"
        >
          <span className="text-[min(4vw,4vh)]">◄</span>
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button 
          onClick={handleInteraction({ x: 1, y: 0 })}
          onTouchEnd={handleInteraction({ x: 1, y: 0 })}
          className={buttonClass}
          aria-label="Right"
        >
          <span className="text-[min(4vw,4vh)]">►</span>
        </button>
      </div>
      <div className="col-start-2 row-start-3">
        <button 
          onClick={handleInteraction({ x: 0, y: 1 })}
          onTouchEnd={handleInteraction({ x: 0, y: 1 })}
          className={buttonClass}
          aria-label="Down"
        >
          <span className="text-[min(4vw,4vh)]">▼</span>
        </button>
      </div>
    </div>
  )
}
