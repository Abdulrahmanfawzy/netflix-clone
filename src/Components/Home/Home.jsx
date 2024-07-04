import React, { useContext } from "react";
import HomeSlider from "../HomeSlider/HomeSlider";
import "./Home.css";
import ApiContext from "../../Context/ApiContext";
import PopularMovies from "./PopularMovies";
import PopularTv from "../Tv/Tv";
import HelmetFun from "../Helmet/Helmet";

export default function Home() {
  // let {getDataForAll} = useContext(ApiContext);
  // let [data]
  // let {}
  return (
    <>
      <HelmetFun title="Home"/>
      <HomeSlider />

      <div className="basic_container my-5">
          <div className="title mb-5">
            <h3>POPULAR MOVIES</h3>
          </div>
          <PopularMovies details="moviedetails" date="release_date" movie_name="title" cachName="MoviesPlaying" endPoint="movie/now_playing" page="5"/>
          <div className="title my-5">
            <h3>TOP RATED MOVIES</h3>
          </div>
          <PopularMovies details="moviedetails" date="release_date" movie_name="title" cachName="MoviesDiscover" endPoint="discover/movie" page="3"/>
          <div className="title my-5">
            <h3>Trending MOVIES</h3>
          </div>
          <PopularMovies details="moviedetails" date="release_date" movie_name="title" cachName="MoviesTrending" endPoint="trending/movie/week" page="3"/>
          <div className="title my-5">
            <h3>POPULAR SERIES</h3>
          </div>
          <PopularMovies details="tvdetails" date="first_air_date" movie_name="name" cachName="airing_todayTV" endPoint="tv/airing_today" page="3"/>
          <div className="title my-5">
            <h3>ON THE AIR SERIES</h3>
          </div>
          <PopularMovies details="tvdetails" date="first_air_date" movie_name="name" cachName="on_the_airTV" endPoint="tv/on_the_air" page="3"/>

      </div>


      


    </>
  );
}
