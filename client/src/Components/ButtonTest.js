import React, { useState } from 'react'


function ButtonTest(props) {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    console.log(count)
    setCount(count+1)
    props.onClick()
  }

  return (
    <button onClick={() => handleClick()}>{count}</button>
  )
}

export default ButtonTest