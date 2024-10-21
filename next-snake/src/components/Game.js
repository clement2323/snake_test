"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSnakeGame } from '../hooks/useSnakeGame'
import GameBoard from './GameBoard'
import Controls from './Controls'
import ScoreDisplay from './ScoreDisplay'
import { getPersonalHighScore, getGlobalHighScore } from '../app/lib/scores'
import { useUser } from '../contexts/UserContext'
import TouchJoystick from './TouchJoystick'

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
  const lastTouchTime = useRef(0);
  const touchDelay = 300; // milliseconds

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

  const handleBoardInteraction = useCallback(() => {
    if (!gameStarted || gameOver) {
      startGame();
      setGameStarted(true);
    }
  }, [gameStarted, gameOver, startGame]);

  const handleControlInteraction = useCallback((direction) => {
    if (!gameStarted || gameOver) {
      startGame();
      setGameStarted(true);
    }
    if (!isPaused) {
      changeDirection(direction);
    }
  }, [gameStarted, gameOver, startGame, changeDirection, isPaused]);

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
    window.addEventListener('touchstart', handleTouchStart, { passive: false });

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
          duration: gameDuration,
          is_active: false,
          date_time: new Date().toISOString(),
          nom_du_jeu: "snake-dirag"
        }),
      })
      if (!response.ok) {
        console.log(JSON.stringify({
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
  }, [user, fetchHighScores, gameDuration])

  useEffect(() => {
    if (gameOver) {
      saveScore(score);
    }
  }, [gameOver, score, saveScore]);

  const handleResumeGame = useCallback(() => {
    if (isPaused) {
      pauseGame(); // Cette fonction devrait basculer l'état de pause
    }
  }, [isPaused, pauseGame]);

  const handlePause = useCallback((e) => {
    if (e.type === 'touchend') {
      e.preventDefault();
    }
    pauseGame();
  }, [pauseGame]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-between p-2">
        <div className="w-full max-w-md mb-2 flex justify-between items-center">
          <ScoreDisplay 
            score={score} 
            personalHighScore={personalHighScore}
            globalHighScore={globalHighScore}
          />
          <div className="ml-auto">
            <button
              onClick={handlePause}
              onTouchEnd={handlePause}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
        <div className="w-full max-w-md aspect-square mb-2">
          <GameBoard 
            snake={snake} 
            food={food} 
            bonus={bonus} 
            isPaused={isPaused}
          />
        </div>
        <div className="w-full max-w-md">
          <Controls onDirectionChange={handleControlInteraction} />
        </div>
      </div>
    </div>
  )
}
