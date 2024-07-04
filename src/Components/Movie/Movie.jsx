import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { moviesApi } from "../../Context/movies";
import "../Home/Home.css";
import "./movie.css";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import Progress from "../Progress/Progress";
import HelmetFun from "../Helmet/Helmet";

let arr= [];
export default function Movie() {
  let { getAllMovies, getAllGenres } = useContext(moviesApi);
  let { data, isLoading } = useQuery("AllGenres", () =>
    getAllGenres("genre/movie/list")
  );
  let allMoviesByGenres = useQuery("AllMoviesByGenres", () =>
    getAllMovies("discover/movie", 28 , 6)
  );
  let [items, setItems] = useState(null);
  let [movies, setMovies] = useState(null);
  let [loadMoreMovies, setLoadMoreMovies] = useState(null);
  let [pageNum, setPageNum] = useState(7);
  let [loader, setLoader] = useState(false);
  let [moreLoader, setMoreLoader] = useState(false);
  let [genreId, setGenreId] = useState(null);

  async function handleMovieType(e) {
    arr = [];
    setGenreId(e.target.value);
    setLoader(true);
    let { data } = await getAllMovies("discover/movie", e.target.value , 6);
    setMovies(data.results);
    setLoader(false);
    setLoadMoreMovies(null);
  }
  
  async function handleLoadMore(){
    
    setLoadMoreMovies(null);
    setMoreLoader(true);
    setPageNum(pageNum+1);
    let { data } = await getAllMovies("discover/movie", genreId , pageNum);
    arr.push(...data.results);
    setTimeout(()=>{
      setLoadMoreMovies(arr);
      setMoreLoader(false);
    },500)
  }

  useEffect(() => {
    
    if (isLoading == false) {
      setItems(data.data?.genres);
    }
    if (allMoviesByGenres.isLoading == false) {
      setGenreId(28)
      setMovies(allMoviesByGenres.data.data.results);
    }
  }, [data, isLoading, allMoviesByGenres.isLoading]);

  return (
    <>
      <HelmetFun title="Movies"/>
      <div className="movies_select basic_container">
        <div className="d-flex w-100 justify-content-between align-items-center">
          <div>
            <h3>Movies</h3>
          </div>
          <div style={{ width: "250px" }}>
            <select
              style={{ cursor: "pointer" }}
              onChange={(e) => handleMovieType(e)}
              className="form-select mx-auto"
              aria-label="Default select example"
            >
              {items
                ? items.map((el, index) => (
                    <option value={`${el.id}`} key={index}>
                      {el.name}
                    </option>
                  ))
                : ""}
            </select>
          </div>
        </div>
        <div className="row">
          {movies ? (
            movies.map((movie, ind) => (
              <div
                className="col-md-3 col-sm-6 mt-4 movies_item position-relative"
                key={ind}
              >
                <div>
                  <img
                    className="w-100 rounded-2"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt=""
                  />
                </div>
                <Link to={`/moviedetails/${movie.id}`} className="icon_youtube">
                  <i className="fa-brands fa-youtube"></i>
                </Link>
                <Link
                  to={`/moviedetails/${movie.id}`}
                  className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
                >
                  <Progress vote={movie.vote_average.toFixed(1)}/>
                  <section className="mb-2 mt-2">
                    {movie.release_date.split("-")[0]}
                  </section>
                  <section className="mb-3">
                    {movie.title.split(" ").slice(0, 4).join(" ")}
                  </section>
                </Link>
              </div>
            ))
          ) : <Loading />
          // loader ? <div className="d-flex justify-content-center align-items-center vh-100">
          //   <Loading />
          // </div>
          //  : ""
           }
        </div>
      
      
        
        <div className="row">
          {loadMoreMovies ? (
            loadMoreMovies.map((movie, ind) => (
              <div
                className="col-md-3 col-sm-6 mt-4 movies_item position-relative"
                key={ind}
                >
                <div>
                  <img
                    className="w-100"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt=""
                  />
                </div>
                <Link to={`/moviedetails/${movie.id}`} className="icon_youtube">
                  <i className="fa-brands fa-youtube"></i>
                </Link>
                <Link
                  to={`/moviedetails/${movie.id}`}
                  className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
                >
                  <Progress vote={movie.vote_average.toFixed(1)}/>
      
                  <section className="mb-2 mt-3">
                    {movie.release_date.split("-")[0]}
                  </section>
                  <section className="mb-3">
                    {movie.title.split(" ").slice(0, 4).join(" ")}
                  </section>
                </Link>
              </div>
            ))
          ) : 
          loader ? <div className="d-flex justify-content-center align-items-center vh-100">
            <Loading />
          </div>
           : ""
           }
        </div>
      
        <button onClick={handleLoadMore} className="my-5 w-100 py-2 btn text-white btn_load_more">
          {moreLoader?<i className="fa-solid fa-spinner fa-spin text-white fs-3"></i>:"Load More"}
        </button>
      
      </div>
    </>
  );
}
