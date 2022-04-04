import React, { useState } from 'react'

function TestComponent({parentCallback}) {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => {
      const newValue = count+1
      setCount(newValue)
      parentCallback(newValue)
    }}>{count}</button>
  )
}

export default TestComponent