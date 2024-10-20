export default function ScoreDisplay({ score, personalHighScore, globalHighScore, globalHighScoreUsername }) {
  return (
    <div className="text-white text-xl mb-4 text-left italic">
      <p>Score : {score}</p>
      <p>Records :</p>
      <ul className="list-disc list-inside pl-4">
        <li>Perso : {personalHighScore}</li>
        <li>DIRAG : {globalHighScore} {globalHighScoreUsername && (
          <>par <span className="text-red-500">{globalHighScoreUsername}</span></>
        )}</li>
      </ul>
    </div>
  )
}
