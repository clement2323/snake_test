export default function GameBoard({ snake, food, bonus, isPaused }) {
  const gridSize = 20;

  return (
    <div 
      className="game-board relative w-full aspect-square max-w-[400px] border-2 border-gray-800 bg-black"
    >
      {[...Array(gridSize)].map((_, rowIndex) =>
        [...Array(gridSize)].map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="absolute border border-gray-700"
            style={{
              left: `${(colIndex / gridSize) * 100}%`,
              top: `${(rowIndex / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
            }}
          />
        ))
      )}
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute bg-green-400 border border-green-500"
          style={{
            left: `${(segment.x / gridSize) * 100}%`,
            top: `${(segment.y / gridSize) * 100}%`,
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
          }}
        />
      ))}
      <div
        className="absolute bg-red-600"
        style={{
          left: `${(food.x / gridSize) * 100}%`,
          top: `${(food.y / gridSize) * 100}%`,
          width: `${100 / gridSize}%`,
          height: `${100 / gridSize}%`,
        }}
      />
      {bonus && (
        <div
          className="absolute bg-yellow-200 animate-pulse"
          style={{
            left: `${(bonus.x / gridSize) * 100}%`,
            top: `${(bonus.y / gridSize) * 100}%`,
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
          }}
        />
      )}
      
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-2xl">Pause</p>
          </div>
        </div>
      )}
    </div>
  )
}
