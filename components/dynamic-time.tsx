'use client'

import { useState, useEffect } from 'react'

export default function DynamicTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')

  return (
    <div className="flex items-end space-x-1">
      <p className="text-2xl">{`${formattedHours}:${formattedMinutes}`}</p>
      <p className="text-sm">{ampm}</p>
    </div>
  )
}
