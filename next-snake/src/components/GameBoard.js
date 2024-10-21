export default function GameBoard({ snake, food, bonus, onInteraction, isPaused }) {
  const gridSize = 20;
  const cellSize = 20;

  const handleInteraction = (e) => {
    e.preventDefault();
    onInteraction();
  };

  return (
    <div 
      className="game-board relative w-[400px] h-[400px] border-2 border-gray-800 bg-black"
      onTouchStart={handleInteraction}
      onClick={handleInteraction}
    >
      {[...Array(gridSize)].map((_, rowIndex) =>
        [...Array(gridSize)].map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="absolute border border-gray-700"
            style={{
              left: `${colIndex * cellSize}px`,
              top: `${rowIndex * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        ))
      )}
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute bg-green-400 border border-green-500"
          style={{
            left: `${segment.x * cellSize}px`,
            top: `${segment.y * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
        />
      ))}
      <div
        className="absolute bg-red-600"
        style={{
          left: `${food.x * cellSize}px`,
          top: `${food.y * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
        }}
      />
      {bonus && (
        <div
          className="absolute bg-yellow-200 animate-pulse"
          style={{
            left: `${bonus.x * cellSize}px`,
            top: `${bonus.y * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
        />
      )}
      
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-2xl">Pause</p>
            <p className="text-white text-xl mt-2">Réappuyer pour reprendre</p>
          </div>
        </div>
      )}
    </div>
  )
}
