export default function ScoreDisplay({ score, personalHighScore, globalHighScore }) {
  return (
    <div className="text-left text-sm">
      <p>Score: {score}</p>
      <p>Record Personnel: {personalHighScore}</p>
      <p>Record DIRAG: {globalHighScore.score} (by <span className="text-red-500 font-bold animate-pulse">{globalHighScore.nom_utilisateur}</span>)</p>
    </div>
  )
}
