export default function ScoreDisplay({ score, personalHighScore, globalHighScore }) {
  return (
    <div className="mb-4 text-white">
      <p>Score: {score}</p>
      <p>Meilleur score personnel: {personalHighScore}</p>
      <p>Meilleur score global: {globalHighScore}</p>
    </div>
  )
}
