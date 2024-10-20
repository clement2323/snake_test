"use client"

import { useEffect, useState, useCallback } from 'react'
import { useSnakeGame } from '../hooks/useSnakeGame'
import GameBoard from './GameBoard'
import Controls from './Controls'
import ScoreDisplay from './ScoreDisplay'
import StartScreen from './StartScreen'
import { getPersonalHighScore, getGlobalHighScore } from '../app/lib/scores'
import { useUser } from '../contexts/UserContext'

export default function Game() {
  const { 
    snake, 
    food, 
    bonus, 
    score, 
    gameOver, 
    isPaused, 
    startGame, 
    pauseGame, 
    changeDirection, 
    gameDuration 
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

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [changeDirection, gameStarted, gameOver, startGame])

  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (gameOver) {
      saveScore(score)
        
    }
  }, [gameOver, score])

  const saveScore = async (score) => {
    if (!user) return

    try {
      const response = await fetch('http://localhost:3001/api/games/add', {
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
  }

  const togglePause = (e) => {
    e.stopPropagation()
    pauseGame()
  }

  return (
    <div className="relative">
      <ScoreDisplay 
        score={score} 
        personalHighScore={personalHighScore} 
        globalHighScore={globalHighScore.score}
        globalHighScoreUsername={globalHighScore.nom_utilisateur}
      />
      <GameBoard snake={snake} food={food} bonus={bonus} />
      <Controls onDirectionChange={changeDirection} />
      {gameStarted && (
        <button
          onClick={togglePause}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
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
        <StartScreen
          gameOver={gameOver}
          score={score}
          onStart={() => {
            startGame()
            setGameStarted(true)
          }}
        />
      )}
    </div>
  )
}
