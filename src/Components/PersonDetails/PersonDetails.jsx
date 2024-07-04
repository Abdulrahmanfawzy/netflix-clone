import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { moviesApi } from "../../Context/movies";
import Loading from "../Loading";
import "../MovieDetails/movieDetails.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import Progress from "../Progress/Progress";
import HelmetFun from "../Helmet/Helmet";

export default function TvDetails() {
  let { personId } = useParams();
  let { getMovieDetails, getMovieForPerson } = useContext(moviesApi);
  let [items, setItems] = useState(null);
  let [movies, setMovies] = useState(null);
  let [count, setCount] = useState(20);
  let [loader, setLoader] = useState(false);
  let [moreLoader, setMoreLoader] = useState(false);
  let [noMore, setNoMore] = useState(false);

  async function handleMovieDisplay(id) {
    getMovieById(id);
  }

  async function getMovieById(id) {
    let { data } = await getMovieDetails(`person/${id}`);
    console.log(data);
    setItems(data);
  }

  async function handleLoadMore() {
    setMoreLoader(true);
    setCount(count + 12);
    setMoreLoader(false);
    if (count > movies.length) {
      setNoMore(true);
    } else {
      getMoviesOfPerson(count);
    }
  }

  async function getMoviesOfPerson(count) {
    let arr = [];
    let { data } = await getMovieForPerson(`person/${personId}`);
    if (count < data.cast.length) {
      for (let i = 0; i < count; i++) {
        arr.push(data.cast[i]);
      }
    } else {
      arr.push(...data.cast);
    }
    console.log(count);
    console.log(count > data.cast.length);
    setMovies(arr);
  }

  useEffect(() => {
    getMovieById(personId);
    getMoviesOfPerson(count);
  }, [personId, count]);

  return (
    <>
      <HelmetFun title={items ? items.name : "Person"} />
      {items ? (
        <>
          <div
            className="backPath position-relative"
            style={{
              backgroundPosition: "25% 40%",
              backgroundImage: `linear-gradient(to top, rgb(0, 0, 0) 15%, rgba(0, 0, 0, 0)) ,url(https://image.tmdb.org/t/p/original${items.profile_path})`,
            }}
          >
            <div className="content_overlay_top_bot"></div>

            <div className="overlay_backdrop"></div>
          </div>

          <div className="basic_container allPage">
            <div className="row">
              <div className="col-md-4">
                <div className="mb-4">
                  <img
                    className="d-block w-100 rounded-2"
                    src={`https://image.tmdb.org/t/p/w500${items.profile_path}`}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-md-8">
                <h2 className="title_movie">{items.name}</h2>
                <h2 className="title_movie mb-3">
                  {items.birthday?.split("-")[0]}
                </h2>
                <h3>Biography</h3>
                <section>
                  {items.biography ? items.biography : "No Biography found"}
                </section>
                <section className="mt-2">
                  Place of Birth:{" "}
                  {items.place_of_birth
                    ? items.place_of_birth
                    : "No Place found"}
                </section>
              </div>
            </div>
            <h2 className="cast_title">
              {items.gender == 2 ? "HIS" : "HER"} MOVIES
            </h2>
            <div className="row">
              {movies?.length > 0 ? (
                movies.map((movie, ind) => (
                  <div
                    className="col-md-3 col-sm-6 mt-4 movies_item position-relative"
                    key={ind}
                  >
                    <div>
                      <img
                        className="w-100 rounded-2"
                        src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                        alt=""
                      />
                    </div>
                    <Link
                      to={`/moviedetails/${movie.id}`}
                      className="icon_youtube"
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                    <Link
                      to={`/moviedetails/${movie.id}`}
                      className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
                    >
                      <Progress vote={movie.vote_average.toFixed(1)} />
                      <section className="my-2">
                        {movie.release_date.split("-")[0]}
                      </section>
                      <section className="mb-3">
                        {movie.title.split(" ").slice(0, 4).join(" ")}
                      </section>
                    </Link>
                  </div>
                ))
              ) : (
                <span className="mt-4">No Movies Found</span>
              )}
            </div>

            {noMore ? (
              <button className="my-5 w-100 py-2 btn text-white btn_load_more">
                No More
              </button>
            ) : (
              <button
                onClick={handleLoadMore}
                className="my-5 w-100 py-2 btn text-white btn_load_more"
              >
                {moreLoader ? (
                  <i className="fa-solid fa-spinner fa-spin text-white fs-3"></i>
                ) : (
                  "Load More"
                )}
              </button>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
