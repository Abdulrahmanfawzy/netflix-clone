import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

export default function RecommendItem() {
  let {recommendItem , type} = useParams();
  return <Navigate to={`/${type}/${recommendItem}`}/>
}
