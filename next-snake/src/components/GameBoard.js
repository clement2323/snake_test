export default function GameBoard({ snake, food, bonus }) {
  const gridSize = 20;
  const cellSize = 20;

  return (
    <div className="game-board relative w-[400px] h-[400px] border-2 border-gray-800 bg-black">
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
    </div>
  )
}
