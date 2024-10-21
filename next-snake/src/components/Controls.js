export default function Controls({ onDirectionChange }) {
  const handleInteraction = (direction) => (e) => {
    if (e.type === 'touchend') {
      e.preventDefault();
    }
    onDirectionChange(direction);
  };

  const buttonClass = "aspect-square bg-black text-white rounded-full border-2 border-white shadow-[0_0_0_2px_#000] hover:bg-gray-800 focus:outline-none flex items-center justify-center text-lg";

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <button 
        onClick={handleInteraction({ x: 0, y: -1 })}
        onTouchEnd={handleInteraction({ x: 0, y: -1 })}
        className={`col-start-2 ${buttonClass}`}
        aria-label="Up"
      >
        ▲
      </button>
      <button 
        onClick={handleInteraction({ x: -1, y: 0 })}
        onTouchEnd={handleInteraction({ x: -1, y: 0 })}
        className={`col-start-1 row-start-2 ${buttonClass}`}
        aria-label="Left"
      >
        ◄
      </button>
      <button 
        onClick={handleInteraction({ x: 1, y: 0 })}
        onTouchEnd={handleInteraction({ x: 1, y: 0 })}
        className={`col-start-3 row-start-2 ${buttonClass}`}
        aria-label="Right"
      >
        ►
      </button>
      <button 
        onClick={handleInteraction({ x: 0, y: 1 })}
        onTouchEnd={handleInteraction({ x: 0, y: 1 })}
        className={`col-start-2 row-start-3 ${buttonClass}`}
        aria-label="Down"
      >
        ▼
      </button>
    </div>
  )
}
