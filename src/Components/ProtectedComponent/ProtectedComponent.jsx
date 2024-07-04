import React from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectedComponent({children}) {
  let userid = window.localStorage.getItem("userid");
  if(userid){
    return children
  }else{
    return <Navigate to="/login"/>
  }
}
