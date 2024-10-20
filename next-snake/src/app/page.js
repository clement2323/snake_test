import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Snake Dirag</h1>
        <div className="space-y-4">
          <Link href="/register" className="block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-red-600 transition duration-300 border-2 border-black shadow-[0_0_0_2px_white]">
            Register
          </Link>
          <Link href="/login" className="block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-red-600 transition duration-300">
            Login
          </Link>
        </div>
      </main>
    </div>
  )
}
