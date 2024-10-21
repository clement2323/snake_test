export default function Controls({ onDirectionChange }) {
  const handleInteraction = (direction) => (e) => {
    if (e.type === 'touchend') {
      e.preventDefault(); // Cela fonctionnera pour touchend
    }
    onDirectionChange(direction);
  };

  return (
    <div className="grid grid-cols-3 gap-2 mt-4 w-[240px] mx-auto">
      <button 
        onClick={handleInteraction({ x: 0, y: -1 })}
        onTouchEnd={handleInteraction({ x: 0, y: -1 })}
        className="col-start-2 w-16 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
        aria-label="Up"
      >
        ▲
      </button>
      <button 
        onClick={handleInteraction({ x: -1, y: 0 })}
        onTouchEnd={handleInteraction({ x: -1, y: 0 })}
        className="col-start-1 row-start-2 w-16 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
        aria-label="Left"
      >
        ◄
      </button>
      <button 
        onClick={handleInteraction({ x: 1, y: 0 })}
        onTouchEnd={handleInteraction({ x: 1, y: 0 })}
        className="col-start-3 row-start-2 w-16 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
        aria-label="Right"
      >
        ►
      </button>
      <button 
        onClick={handleInteraction({ x: 0, y: 1 })}
        onTouchEnd={handleInteraction({ x: 0, y: 1 })}
        className="col-start-2 row-start-3 w-16 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
        aria-label="Down"
      >
        ▼
      </button>
    </div>
  )
}
