import React, { memo, useEffect, useState } from 'react'
import style from "./style.module.css"
import { useRenderInfo } from '@siberiacancode/reactuse'

interface CounterProps {
  value: number
}

export const Counter:React.FC<CounterProps> = memo(({value}) => {
  const renderInfo = useRenderInfo()
  console.log(renderInfo)
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    setAnimate(true)

  }, [])

console.log(animate)
  return (
    <p className={animate? [style.count, style.active].join(' ') : style.count}>{value}</p>
  )
})