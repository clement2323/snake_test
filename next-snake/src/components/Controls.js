import { useState, useEffect } from 'react';

export default function Controls({ onDirectionChange }) {
  const [canVibrate, setCanVibrate] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    setCanVibrate('vibrate' in navigator);
  }, []);

  const handleInteraction = (direction) => (e) => {
    if (e.type === 'touchstart') {
      setActiveButton(direction);
    } else if (e.type === 'touchend' || e.type === 'click') {
      e.preventDefault();
      setActiveButton(null);
      onDirectionChange(direction, e.type);
    }
  };

  const buttonClass = (direction) => `
    w-full h-full bg-black text-white rounded-full border-2 border-white 
    shadow-[0_0_0_2px_#000] hover:bg-gray-800 focus:outline-none 
    flex items-center justify-center transition-all duration-150 ease-in-out
    hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.7)] 
    active:shadow-[0_0_15px_5px_rgba(255,255,255,0.9)]
    ${activeButton === direction ? 'bg-gray-800 shadow-[0_0_15px_5px_rgba(255,255,255,0.9)]' : ''}
  `;

  return (
    <div className="w-[calc(2/3*2/3*100%)] aspect-square grid grid-cols-3 grid-rows-3 gap-2 mx-auto">
      <div className="col-start-2 row-start-1">
        <button 
          onClick={handleInteraction({ x: 0, y: -1 })}
          onTouchStart={handleInteraction({ x: 0, y: -1 })}
          onTouchEnd={handleInteraction({ x: 0, y: -1 })}
          className={buttonClass({ x: 0, y: -1 })}
          aria-label="Up"
        >
          <span className="text-[min(2.8vw,2.8vh)]">▲</span>
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button 
          onClick={handleInteraction({ x: -1, y: 0 })}
          onTouchStart={handleInteraction({ x: -1, y: 0 })}
          onTouchEnd={handleInteraction({ x: -1, y: 0 })}
          className={buttonClass({ x: -1, y: 0 })}
          aria-label="Left"
        >
          <span className="text-[min(4vw,4vh)]">◄</span>
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button 
          onClick={handleInteraction({ x: 1, y: 0 })}
          onTouchStart={handleInteraction({ x: 1, y: 0 })}
          onTouchEnd={handleInteraction({ x: 1, y: 0 })}
          className={buttonClass({ x: 1, y: 0 })}
          aria-label="Right"
        >
          <span className="text-[min(4vw,4vh)]">►</span>
        </button>
      </div>
      <div className="col-start-2 row-start-3">
        <button 
          onClick={handleInteraction({ x: 0, y: 1 })}
          onTouchStart={handleInteraction({ x: 0, y: 1 })}
          onTouchEnd={handleInteraction({ x: 0, y: 1 })}
          className={buttonClass({ x: 0, y: 1 })}
          aria-label="Down"
        >
          <span className="text-[min(4vw,4vh)]">▼</span>
        </button>
      </div>
    </div>
  )
}
