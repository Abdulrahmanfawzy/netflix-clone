import React from 'react'
import { Bars, InfinitySpin } from 'react-loader-spinner'

export default function Loading() {
  return ( <div style={{width: "100%" , }} className='loading'>
    <InfinitySpin
  visible={true}
  width="200"
  color="#fff"
  ariaLabel="infinity-spin-loading"
  />
  </div>
  )
}
