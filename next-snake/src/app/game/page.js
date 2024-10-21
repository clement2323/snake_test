'use client'

import GameWrapper from '../../components/GameWrapper'
import { useContext, useEffect } from 'react'
import { UserContext } from '@/contexts/UserContext'

export default function Home() {
  const { user } = useContext(UserContext)

  useEffect(() => {
    console.log('User context changed:', user);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <main className="text-center">
        {user && (
          <div className="mb-4">
            <p className="text-xl">
            <span className="font-bold italic">bonne partie </span>
              {' '}{user.nom_utilisateur}{' !'}
            </p>
          </div>
        )}
        <GameWrapper />
      </main>

      <footer className="mt-8 text-sm text-gray-500">
        <p>Created with Next.js and React</p>
      </footer>
    </div>
  )
}
//add tableau descore
