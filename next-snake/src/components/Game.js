"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSnakeGame } from '../hooks/useSnakeGame'
import GameBoard from './GameBoard'
import Controls from './Controls'
import ScoreDisplay from './ScoreDisplay'
import { getPersonalHighScore, getGlobalHighScore } from '../app/lib/scores'
import { useUser } from '../contexts/UserContext'

export default function Game() {
  const { 
    snake, 
    food, 
    bonus, 
    score, 
    gameOver, 
    startGame, 
    changeDirection, 
    gameDuration,
    isPaused,
    pauseGame
  } = useSnakeGame()
  const { user, setUser } = useUser()
  const [personalHighScore, setPersonalHighScore] = useState(0)
  const [globalHighScore, setGlobalHighScore] = useState({ score: 0, nom_utilisateur: '' })
  const [gameStarted, setGameStarted] = useState(false)

  const fetchHighScores = useCallback(async () => {
    try {
      const [personalHigh, globalHigh] = await Promise.all([
        user && user.id ? getPersonalHighScore(user.id) : Promise.resolve(0),
        getGlobalHighScore()
      ])
      setPersonalHighScore(personalHigh)
      setGlobalHighScore(globalHigh)
    } catch (error) {
      console.error('Error fetching high scores:', error)
    }
  }, [user])

  useEffect(() => {
    fetchHighScores()
  }, [fetchHighScores])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        
        if (!gameStarted || gameOver) {
          startGame()
          setGameStarted(true)
        }
        
        switch (e.key) {
          case 'ArrowUp': changeDirection({ x: 0, y: -1 }); break
          case 'ArrowDown': changeDirection({ x: 0, y: 1 }); break
          case 'ArrowLeft': changeDirection({ x: -1, y: 0 }); break
          case 'ArrowRight': changeDirection({ x: 1, y: 0 }); break
        }
      }
    }

    const handleTouchStart = (e) => {
      e.preventDefault();
      handleBoardInteraction();
    }

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
    }
  }, [changeDirection, gameStarted, gameOver, startGame, handleBoardInteraction]);

  const [saveMessage, setSaveMessage] = useState('')

  const saveScore = useCallback(async (score) => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: user.id,
          score: score,
          duration: gameDuration, // Utilisez gameDuration ici
          is_active: false,
          date_time: new Date().toISOString(),
          nom_du_jeu: "snake-dirag"
        }),
      })
      if (!response.ok) {
        console.log( JSON.stringify({
          player_id: user.id,
          score: score,
          duration: gameDuration,
          is_active: false,
          date_time: new Date().toISOString(),
          nom_du_jeu: "snake-dirag"
        }))
        const errorText = await response.text();
        throw new Error(`Failed to save score: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const savedGame = await response.json()
      console.log('Game saved:', savedGame)
      
      // Fetch updated high scores after saving
      fetchHighScores()
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }, [user, fetchHighScores])

  useEffect(() => {
    if (gameOver) {
      saveScore(score);
    }
  }, [gameOver, score, saveScore]);

  const lastTouchTime = useRef(0);
  const touchDelay = 300; // milliseconds

  const handleBoardInteraction = useCallback(() => {
    const now = Date.now();
    if (now - lastTouchTime.current < touchDelay) {
      return; // Ignore rapid taps
    }
    lastTouchTime.current = now;

    if (gameStarted && !gameOver) {
      pauseGame();
    } else if (!gameStarted || gameOver) {
      startGame();
      setGameStarted(true);
    }
  }, [gameStarted, gameOver, pauseGame, startGame]);

  return (
    <div className="relative">
      <ScoreDisplay 
        score={score} 
        personalHighScore={personalHighScore} 
        globalHighScore={globalHighScore.score}
        globalHighScoreUsername={globalHighScore.nom_utilisateur}
      />
      <GameBoard 
        snake={snake} 
        food={food} 
        bonus={bonus} 
        onInteraction={handleBoardInteraction}
        isPaused={isPaused}
      />
      <Controls onDirectionChange={changeDirection} />
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-8 rounded-lg text-white text-center border border-white">
            <p className="mb-4 text-xl">
              {user ? `Salut ${user.nom_utilisateur}, appuie sur l'écran pour commencer` : "Appuie sur l'écran pour commencer"}
            </p>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-8 rounded-lg text-white text-center border border-white">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <button
              onClick={() => {
                startGame()
                setGameStarted(true)
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Rejouer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
