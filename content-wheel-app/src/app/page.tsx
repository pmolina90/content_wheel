'use client'

import { useState } from 'react'
import WheelDisplay from '../components/WheelDisplay'
import ResultsDisplay from '../components/ResultsDisplay'

// Hardcoded categories and choices
const categories = [
  {
    name: 'Genre',
    color: '#FF6B6B',
    choices: ['Rockstar', 'Retro', 'Art Deco', 'Military', 'Gothic', 'Kawaii', 'Modern Renaissance', 'Cyberpunk', 'Afro Futurist', 'Monochrome']
  },
  {
    name: 'Styles of Fashion',
    color: '#4ECDC4',
    choices: ['Casual', 'Chic', 'Bohemian', 'Street Wear', 'Preppy', 'Vintage', 'Romantic', 'Glamourous', 'Business-Casual']
  },
  {
    name: 'Colors',
    color: '#45B7D1',
    choices: ['Red', 'Yellow', 'Green', 'Burgundy', 'Blue', 'Purple', 'Orange', 'Beige', 'Black', 'White']
  }
]

export default function Home() {
  const [results, setResults] = useState<string[]>([])

  const handleSpin = (newResults: string[]) => {
    setResults(newResults)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-center py-4 bg-blue-600 text-white">Spin the Wheel</h1>
        <WheelDisplay categories={categories} onSpin={handleSpin} />
        <ResultsDisplay results={results} />
      </div>
    </main>
  )
}

