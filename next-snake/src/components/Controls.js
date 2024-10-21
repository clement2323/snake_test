export default function Controls({ onDirectionChange }) {
  const handleInteraction = (direction) => (e) => {
    if (e.type === 'touchend') {
      e.preventDefault();
    }
    onDirectionChange(direction);
  };

  const buttonClass = "w-full h-full bg-black text-white rounded-full border-2 border-white shadow-[0_0_0_2px_#000] hover:bg-gray-800 focus:outline-none flex items-center justify-center";

  return (
    <div className="w-2/3 aspect-square grid grid-cols-3 grid-rows-3 gap-2 mx-auto">
      <div className="col-start-2 row-start-1">
        <button 
          onClick={handleInteraction({ x: 0, y: -1 })}
          onTouchEnd={handleInteraction({ x: 0, y: -1 })}
          className={buttonClass}
          aria-label="Up"
        >
          <span className="text-[min(2.7vw,2.7vh)]">▲</span>
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button 
          onClick={handleInteraction({ x: -1, y: 0 })}
          onTouchEnd={handleInteraction({ x: -1, y: 0 })}
          className={buttonClass}
          aria-label="Left"
        >
          <span className="text-[min(2.7vw,2.7vh)]">◄</span>
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button 
          onClick={handleInteraction({ x: 1, y: 0 })}
          onTouchEnd={handleInteraction({ x: 1, y: 0 })}
          className={buttonClass}
          aria-label="Right"
        >
          <span className="text-[min(2.7vw,2.7vh)]">►</span>
        </button>
      </div>
      <div className="col-start-2 row-start-3">
        <button 
          onClick={handleInteraction({ x: 0, y: 1 })}
          onTouchEnd={handleInteraction({ x: 0, y: 1 })}
          className={buttonClass}
          aria-label="Down"
        >
          <span className="text-[min(2.7vw,2.7vh)]">▼</span>
        </button>
      </div>
    </div>
  )
}
