import React, { useContext, useEffect, useState } from "react";
import "../HomeSlider/HomeSlider.css";
import { moviesApi } from "../../Context/movies";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import Progress from "../Progress/Progress";
import HelmetFun from "../Helmet/Helmet";
export default function Search() {
  let { searchFun } = useContext(moviesApi);
  let [type, setType] = useState("movie");
  let [movies, setMovies] = useState(null);
  let [targetDetails, setTargetDetails] = useState("moviedetails");
  let [date, setDate] = useState("release_date");
  let [name, setName] = useState("title");
  let [loader, setLoader] = useState(false);
  let [NoData, setNoData] = useState(false);
  let [poster, setPoster] = useState("poster_path");
  let [biography, setBiography] = useState(false);
  let [itemId, setItemId] = useState(1);
  let [startSearch, setStartSearch] = useState("planet");

  function handleSearchType(type) {
    setType(type);
    if (type == "movie") {
      setItemId(1);
      setTargetDetails("moviedetails");
      setName("title");
      setDate("release_date");
      setPoster("poster_path");
      setBiography(false);
    }
    if (type == "tv") {
      setItemId(2);
      setTargetDetails("tvdetails");
      setName("name");
      setDate("first_air_date");
      setPoster("poster_path");
      setBiography(false);
      setStartSearch("");
      setMovies(null);
    }
    if (type == "person") {
      setItemId(3);
      setTargetDetails("persondetails");
      setName("name");
      setDate(false);
      setPoster("profile_path");
      setBiography(true);
      setStartSearch("");
      setMovies(null);
    }
  }

  async function handleSearch(e) {
    setStartSearch(null);

    let { data } = await searchFun(type, e.target.value);
    console.log(data);
    if (e.target.value) {
      setNoData(false);
    }
    if (data.results.length > 0) {
      setMovies(data.results);
    } else {
      setMovies(null);
      setNoData(true);
    }
  }

  async function handleStartSearch() {
    let { data } = await searchFun("movie", "planet");
    setMovies(data.results);
  }

  useEffect(() => {
    handleStartSearch();
  }, []);

  return (
    <>
      <>
        <HelmetFun title="Search"/>
        <div style={{ marginTop: "150px" }} className="basic_container mb-5">
          <div className="row">
            <div className="col-sm-4">
              <button
                onClick={() => handleSearchType("movie")}
                style={{ paddingTop: "13px", paddingBottom: "13px" }}
                className={`w-100 btn text-white  ${
                  itemId == 1 ? "watch_link" : ""
                }`}
              >
                Movies
              </button>
            </div>
            <div className="col-sm-4">
              <button
                onClick={() => handleSearchType("tv")}
                style={{ paddingTop: "13px", paddingBottom: "13px" }}
                className={`w-100 btn text-white  ${
                  itemId == 2 ? "watch_link" : ""
                }`}
              >
                TV
              </button>
            </div>
            <div className="col-sm-4">
              <button
                onClick={() => handleSearchType("person")}
                style={{ paddingTop: "13px", paddingBottom: "13px" }}
                className={`w-100 btn text-white  ${
                  itemId == 3 ? "watch_link" : ""
                }`}
              >
                PEOPLE
              </button>
            </div>
          </div>
        
          <div>
            <input
              value={startSearch}
              onChange={(e) => handleSearch(e)}
              id="searchInpt"
              type="text"
              placeholder="Search Netflix..."
              className="bg-transparent text-white my-4"
            />
          </div>
        
          <div className="row">
            {movies
              ? movies.map((movie, ind) => (
                  <div
                    className="col-md-3 col-sm-6 mt-4 movies_item position-relative"
                    key={ind}
                  >
                    <div>
                      <img
                        className="w-100 rounded-2"
                        src={`https://image.tmdb.org/t/p/w500${movie[poster]}`}
                        alt=""
                      />
                    </div>
                    <Link
                      to={`/${targetDetails}/${movie.id}`}
                      className="icon_youtube"
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                    <Link
                      to={`/${targetDetails}/${movie.id}`}
                      className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
                    >
                      {date ? (
                        <Progress vote={movie.vote_average.toFixed(1)} />
                      ) : (
                        ""
                      )}
        
                      {date ? (
                        <section className="my-2">
                          {movie[date]?.split("-")[0]}
                        </section>
                      ) : (
                        ""
                      )}
        
                      <h4 className="mb-3">
                        {movie[name]?.split(" ").slice(0, 4).join(" ")}
                      </h4>
        
                      {biography ? (
                        <section
                          style={{ marginTop: "-10px" }}
                          className="mb-4 d-flex flex-wrap"
                        >
                          {movie.known_for?.map((el, index) => (
                            <div key={index}>{el.title} ,</div>
                          ))}
                        </section>
                      ) : (
                        ""
                      )}
                    </Link>
                  </div>
                ))
              : NoData
              ? "No Movies Founded..."
              : ""}
          </div>
        </div>
      </>
    </>
  );
}
