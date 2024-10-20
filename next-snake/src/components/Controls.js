export default function Controls({ onDirectionChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 w-[240px] mx-auto">
      <button onClick={() => onDirectionChange({ x: 0, y: -1 })} className="col-start-2 w-16 h-16 bg-orange-500 text-black rounded-full hover:bg-orange-600 focus:outline-none border-2 border-black shadow-[0_0_0_2px_white]">↑</button>
      <button onClick={() => onDirectionChange({ x: -1, y: 0 })} className="col-start-1 row-start-2 w-16 h-16 bg-orange-500 text-black rounded-full hover:bg-orange-600 focus:outline-none border-2 border-black shadow-[0_0_0_2px_white]">←</button>
      <button onClick={() => onDirectionChange({ x: 1, y: 0 })} className="col-start-3 row-start-2 w-16 h-16 bg-orange-500 text-black rounded-full hover:bg-orange-600 focus:outline-none border-2 border-black shadow-[0_0_0_2px_white]">→</button>
      <button onClick={() => onDirectionChange({ x: 0, y: 1 })} className="col-start-2 row-start-3 w-16 h-16 bg-orange-500 text-black rounded-full hover:bg-orange-600 focus:outline-none border-2 border-black shadow-[0_0_0_2px_white]">↓</button>
    </div>
  )
}
