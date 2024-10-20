export default function StartScreen({ gameOver, score }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
      <h2 className="text-3xl font-bold mb-4">{gameOver ? 'Game Over' : 'Snake Game'}</h2>
      {gameOver && <p className="text-xl mb-4">Your score: {score}</p>}
      <p className="text-xl text-white">
        {gameOver ? 'Appuyez 2 fois pour rejouer' : 'Appuyez 2 fois pour jouer'}
      </p>
    </div>
  )
}
