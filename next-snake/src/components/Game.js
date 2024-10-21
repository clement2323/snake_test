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
  const [canVibrate, setCanVibrate] = useState(false);

  useEffect(() => {
    // Vérifier si la vibration est supportée
    if ('vibrate' in navigator) {
      setCanVibrate(true);
    }
  }, []);

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

  const handleStartGame = useCallback(() => {
    if (!gameStarted) {
      startGame();
      setGameStarted(true);
      if (canVibrate) {
        navigator.vibrate(200); // Vibrer pendant 200ms
      }
    }
  }, [gameStarted, startGame, canVibrate]);

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
        handleStartGame();
        
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
      handleStartGame();
    }

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
    }
  }, [changeDirection, gameStarted, gameOver, startGame, handleStartGame]);

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
      {!gameStarted ? (
        <div 
          className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
          onClick={handleStartGame}
          onTouchStart={handleStartGame}
        >
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 hover:shadow-xl transition-all duration-300 ease-in-out">
            <p className="text-white text-2xl font-bold">Toucher pour commencer à jouer</p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}
