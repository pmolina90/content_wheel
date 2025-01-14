'use client'

import { useState } from 'react'
import { Wheel } from '../types'

export default function WheelCreator({ addWheel }: { addWheel: (wheel: Wheel) => void }) {
  const [category, setCategory] = useState('')
  const [choices, setChoices] = useState<string[]>([''])
  const [color, setColor] = useState('#3B82F6')

  const handleAddChoice = () => {
    setChoices([...choices, ''])
  }

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices]
    newChoices[index] = value
    setChoices(newChoices)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addWheel({ category, choices: choices.filter(c => c.trim() !== ''), color })
    setCategory('')
    setChoices([''])
    setColor('#3B82F6')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4" id="wheelCreator">
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter Category"
        className="w-full p-2 border rounded"
        required
      />
      {choices.map((choice, index) => (
        <input
          key={index}
          type="text"
          value={choice}
          onChange={(e) => handleChoiceChange(index, e.target.value)}
          placeholder={`Choice ${index + 1}`}
          className="w-full p-2 border rounded"
          required
        />
      ))}
      <button type="button" onClick={handleAddChoice} className="w-full p-2 bg-gray-200 rounded">
        Add Choice
      </button>
      <div className="flex items-center space-x-2">
        <label htmlFor="colorPicker" className="text-sm">Wheel Color:</label>
        <input
          id="colorPicker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="p-1 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Create Wheel
      </button>
    </form>
  )
}

