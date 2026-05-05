import React from 'react'
import { icons, Ico } from './Icons'

export default function Spinner() {
  return <Ico d={icons.loader} size={20} color="#0ea5e9" style={{ animation: "spin 1s linear infinite" }} />
}
