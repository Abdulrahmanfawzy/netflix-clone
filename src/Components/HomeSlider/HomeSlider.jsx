import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './HomeSlider.css';
import { useQuery } from 'react-query';
import { ApiSliderContext } from '../../Context/ApiContext';
import { Link } from 'react-router-dom';
import Progress from '../Progress/Progress';

export default function HomeSlider() {

  let {getDataForAll} = useContext(ApiSliderContext);
  let allSliderHomeData = useQuery("ApiHomeSlider" , ()=>getDataForAll("discover/movie"));
  let getGenresByList = useQuery("getGenresByList" , ()=>getDataForAll("genre/movie/list"));
  let [items,setItems] = useState(null);
  let [genres,setGenres] = useState(null);
  let [nameGenres,setNameGenres] = useState(null);
  function getAllGenres(){
    if(!getGenresByList.isLoading){
      setGenres(getGenresByList.data.data.genres);
    }
  }
  function handleHomeSliderApi(){
    let newArr = [];
    if(!allSliderHomeData.isLoading){
      for(let i = 0; i < 15; i++){
        newArr.push(allSliderHomeData?.data.data.results[i])
      }
      newArr.splice(0,1);
      newArr.splice(1,1);
      setItems(newArr);
    }
  }

  useEffect(()=>{
    handleHomeSliderApi();
    getAllGenres();
  },[allSliderHomeData.isLoading,getGenresByList.isLoading])


  return (
    <>
      <div className='vh-100 slider_home'>
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={true}
          className="mySwiper">
          {items?items.map((elment,indexs)=>
            <SwiperSlide key={indexs} className='bg-dark w-100 position-relative'>
              <div>
                <img className='w-100 d-block' src={`https://image.tmdb.org/t/p/original${elment.backdrop_path}`} alt={elment.title} />
              </div>
              <div className="content_overlay"></div>
              <div className="content_overlay_top_bot"></div>
              <div className="home_slider_content">
                <h2>{elment.title}</h2> 
                <Progress vote={elment.vote_average.toFixed(1)}/>
                <div className="overview mt-3">
                  {elment.overview}
                </div>
                <div className='mt-3'>
                  <Link className='watch_link text-white text-decoration-none border d-inline-block rounded-1' to={`/moviedetails/${elment.id}`}>
                  <i className="fa-solid fa-play"></i> Watch Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ):""}
        </Swiper>
      </div>      
    </>
  )
}
