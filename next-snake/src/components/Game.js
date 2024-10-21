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
  const { user } = useUser()
  const [personalHighScore, setPersonalHighScore] = useState(0)
  const [globalHighScore, setGlobalHighScore] = useState({ score: 0, nom_utilisateur: '' })
  const [gameStarted, setGameStarted] = useState(false)
  const [canVibrate, setCanVibrate] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    setCanVibrate('vibrate' in navigator);
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
      setHasInteracted(true);
      if (canVibrate && hasInteracted) {
        navigator.vibrate(200);
      }
    }
  }, [gameStarted, startGame, canVibrate, hasInteracted]);

  const handleControlInteraction = useCallback((direction, eventType) => {
    if (!gameStarted || gameOver) {
      startGame();
      setGameStarted(true);
    }
    setHasInteracted(true);
    if (!isPaused) {
      if (eventType === 'touchend' || eventType === 'click') {
        changeDirection(direction);
        if (canVibrate && hasInteracted) {
          navigator.vibrate(50);
        }
      }
    }
  }, [gameStarted, gameOver, startGame, changeDirection, isPaused, canVibrate, hasInteracted]);

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

  const handleRestart = useCallback(() => {
    setGameStarted(false);
    startGame();
  }, [startGame]);

  return (
    <div className="w-full h-full flex flex-col">
      {!gameStarted ? (
        <div 
          className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
          onClick={handleStartGame}
          onTouchStart={handleStartGame}
        >
          <div className="bg-white bg-opacity-10 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-opacity-20 hover:shadow-xl transition-all duration-300 ease-in-out">
            <p className="text-white text-lg sm:text-xl italic font-light tracking-wide">
              Toucher pour commencer à jouer !
            </p>
          </div>
        </div>
      ) : gameOver ? (
        <div 
          className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
          onClick={handleRestart}
          onTouchStart={handleRestart}
        >
          <div className="bg-white bg-opacity-10 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-opacity-20 hover:shadow-xl transition-all duration-300 ease-in-out">
            <p className="text-white text-lg sm:text-xl italic font-light tracking-wide text-center">
              Game Over
            </p>
            <p className="text-white text-base sm:text-lg mt-2 text-center">
              Score final : {score}
            </p>
            <p className="text-white text-sm sm:text-base mt-4 text-center">
              Toucher pour rejouer !
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-between p-2">
          {/* Welcome message */}
          {user && (
            <div className="w-full text-center mb-2">
              <p className="text-lg sm:text-xl">
                <span className="font-bold italic">Bonne partie </span>
                {user.nom_utilisateur} !
              </p>
            </div>
          )}
          
          {/* Scores and Pause button */}
          <div className="w-full flex justify-between items-center mb-2">
            <ScoreDisplay 
              score={score} 
              personalHighScore={personalHighScore}
              globalHighScore={globalHighScore}
            />
            <button
              onClick={handlePause}
              onTouchEnd={handlePause}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 sm:px-3 rounded text-xs sm:text-sm"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
          
          {/* Game board and Controls */}
          <div className="w-full flex-grow flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center mb-2">
              <div className="w-full h-full max-w-[80vw] max-h-[35vh] aspect-square">
                <GameBoard 
                  snake={snake} 
                  food={food} 
                  bonus={bonus} 
                  isPaused={isPaused}
                />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-full max-w-[80vw] max-h-[35vh] aspect-square">
                <Controls onDirectionChange={handleControlInteraction} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
