'use client'

import { useRef, useEffect, useState } from 'react'

interface Category {
  name: string
  color: string
  choices: string[]
}

interface WheelDisplayProps {
  categories: Category[]
  onSpin: (results: string[]) => void
}

export default function WheelDisplay({ categories, onSpin }: WheelDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotations, setRotations] = useState<number[]>(categories.map(() => 0))

  useEffect(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, categories, rotations)
    }
  }, [categories, rotations])

  const drawWheel = (canvas: HTMLCanvasElement, categories: Category[], rotations: number[]) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const radius = canvas.width / 2
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const numCategories = categories.length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    categories.forEach((category, categoryIndex) => {
      const numChoices = category.choices.length
      const angleStep = (2 * Math.PI) / numChoices
      const innerRadius = (radius / numCategories) * categoryIndex
      const outerRadius = (radius / numCategories) * (categoryIndex + 1)
      const rotationAngle = rotations[categoryIndex] || 0

      category.choices.forEach((choice, choiceIndex) => {
        const startAngle = choiceIndex * angleStep + rotationAngle
        const endAngle = startAngle + angleStep

        ctx.beginPath()
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle)
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
        ctx.closePath()
        ctx.fillStyle = category.color
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.stroke()

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((startAngle + endAngle) / 2)
        ctx.textAlign = 'center'
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '10px Arial'
        ctx.fillText(choice, (innerRadius + outerRadius) / 2, 0)
        ctx.restore()
      })
    })
  }

  const spinWheel = () => {
    const newRotations = categories.map(() => Math.random() * 2 * Math.PI)
    setRotations(newRotations)

    const results = categories.map((category, index) => {
      const choiceIndex = Math.floor(newRotations[index] / (2 * Math.PI / category.choices.length))
      return `${category.name}: ${category.choices[choiceIndex]}`
    })

    onSpin(results)

    if ('vibrate' in navigator) {
      navigator.vibrate(200)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="mx-auto"
      />
      <button 
        onClick={spinWheel}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Spin the Wheel
      </button>
    </div>
  )
}

