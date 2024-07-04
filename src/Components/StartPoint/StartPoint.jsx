import React from 'react'
import "./startPoint.css";
import { Navigate } from 'react-router-dom';
export default function StartPoint() {
  let userid = window.localStorage.getItem("userid");

  if(userid){
    return <Navigate to="/home"/>
  }
  return (
    <div className='start_bg_img d-flex justify-content-center align-items-center'>
      <div className="start_bg_img_overlay"></div>
      <div className="start_point_content text-center">
        <h1>Unlimited movies, TV shows, and more</h1>
        <p>
          Watch anywhere. Cancel anytime.
        </p>
        <h3>
          Ready to watch? Let's login to watch all trending and interacting movies, TV shows.
        </h3>
      </div>
    </div>
  )
}
