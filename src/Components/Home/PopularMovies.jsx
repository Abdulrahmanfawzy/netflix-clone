import React, { useContext, useEffect, useState } from "react";
import { moviesApi } from "../../Context/movies";
import { useQuery } from "react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import "./Home.css";
// import required modules
import { Pagination } from 'swiper/modules';
import { Link } from "react-router-dom";
import Progress from "../Progress/Progress";
import Loading from "../Loading";


export default function PopularMovies({details , page , movie_name , date,cachName,endPoint}) {
  let {getAllMoviesForHome} = useContext(moviesApi);
  let [items , setItems] = useState(null);
  let {data , isLoading} = useQuery(cachName , ()=>getAllMoviesForHome(endPoint,page));
    useEffect(()=>{
        if(data){
            setItems(data.data.results);
        }
    },[isLoading])

  return (
    <div className="movies">  
        <Swiper
        slidesPerView={1}
        spaceBetween={0}
        autoplay={true}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="mySwiper"
      >
        {items?items.map((item,index)=><SwiperSlide className="movies_item position-relative" key={index}>
            <div>
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
            </div>
            <Link to={`/${details}/${item.id}`} className="icon_youtube">
                <i className="fa-brands fa-youtube"></i>
            </Link>
            <Link to={`/${details}/${item.id}`} className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none">
                <Progress vote={item.vote_average.toFixed(1)}/>
                <section className="mb-2 mt-3">{item[date].split("-")[0]}</section>
                <section className="mb-3">{item[movie_name].split(" ").slice(0,4).join(" ")}</section>
            </Link>
        </SwiperSlide>
        
        ):<Loading/>}
        
        </Swiper>
        
    </div>
  )
}
