import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Progress({vote}) {
  return (
    <CircularProgressbar styles={{text: {
      fontSize: '30px',
    },}} strokeWidth={8} value={vote} maxValue={10} text={`${vote}`} >
      
    </CircularProgressbar>
  )
}
