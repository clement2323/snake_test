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
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow flex flex-col items-center justify-between p-4 overflow-hidden">
        <div className="w-full max-w-[500px] flex flex-col items-center justify-center h-full">
          {user && (
            <div className="mb-4 text-center">
              <p className="text-xl">
                <span className="font-bold italic">bonne partie </span>
                {' '}{user.nom_utilisateur}{' !'}
              </p>
            </div>
          )}
          <div className="w-full h-[calc(100vh-8rem)] flex items-center justify-center">
            <GameWrapper />
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        <p>Du fun du fun du fun</p>
      </footer>
    </div>
  )
}
//add tableau descore

