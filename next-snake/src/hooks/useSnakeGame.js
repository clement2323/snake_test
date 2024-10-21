import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const INITIAL_SPEED = 200
export function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [bonus, setBonus] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [gameStartTime, setGameStartTime] = useState(null)
  const [gameDuration, setGameDuration] = useState(0)
  const gameLoopRef = useRef(null)

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return

    setSnake(prevSnake => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
      }

      if (prevSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true)
        endGame()
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prevScore => prevScore + 1)
        setFood(generateFood(newSnake))
        setSpeed(prevSpeed => Math.max(50, prevSpeed - 5))
        if (Math.random() < 0.2) setBonus(generateBonus(newSnake))
      } else if (bonus && newHead.x === bonus.x && newHead.y === bonus.y) {
        setScore(prevScore => prevScore + 5)
        setBonus(null)
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, bonus, isPaused, gameOver])
  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, speed)
    return () => clearInterval(gameLoopRef.current)
  }, [moveSnake, speed])

  const startGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(generateFood(INITIAL_SNAKE))
    setBonus(null)
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
    setSpeed(INITIAL_SPEED)
    setGameStartTime(Date.now())
    setGameDuration(0)
  }

  const pauseGame = () => setIsPaused(!isPaused)

  const changeDirection = (newDirection) => {
    ("Changing snake direction to:", newDirection);
    if (!isPaused) {
      setDirection(prevDirection => {
        if (newDirection.x !== -prevDirection.x || newDirection.y !== -prevDirection.y) {
          return newDirection
        }
        return prevDirection
      })
    }
  }

  const endGame = () => {
    setGameOver(true)
    if (gameStartTime) {
      const endTime = Date.now()
      const duration = Math.floor((endTime - gameStartTime) / 1000) // durée en secondes
      setGameDuration(duration)
    }
    clearInterval(gameLoopRef.current)
  }

  return { 
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
  }
}
function generateFood(snake) {
  let newFood
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
  return newFood
}

function generateBonus(snake) {
  let newBonus
  do {
    newBonus = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.some(segment => segment.x === newBonus.x && segment.y === newBonus.y))
  return newBonus
}
