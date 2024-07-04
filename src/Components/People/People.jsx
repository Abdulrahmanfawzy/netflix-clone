import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { moviesApi } from "../../Context/movies";
import "../Home/Home.css";
import "../Movie/movie.css";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import HelmetFun from "../Helmet/Helmet";
let arr= [];
export default function People() {
  let { getAllPeople } = useContext(moviesApi);
  let {data , isLoading} = useQuery("AllPopularPeople", () =>
    getAllPeople("person/popular" , 1)
  );
  let [items, setItems] = useState(null);
  let [movies, setMovies] = useState(null);
  let [loadMorePeople, setLoadMorePeople] = useState(null);
  let [pageNum, setPageNum] = useState(3);
  let [loader, setLoader] = useState(false);
  let [moreLoader, setMoreLoader] = useState(false);
  let [genreId, setGenreId] = useState(null);

  async function handleLoadMore(){
    setLoadMorePeople(null);
    setMoreLoader(true);
    setPageNum(pageNum+1);
    let { data } = await getAllPeople("person/popular", pageNum);
    arr.push(...data.results);
    setTimeout(()=>{
      setLoadMorePeople(arr);
      setMoreLoader(false);
    },500)
  }

  useEffect(() => {
    console.log(data);
    if (isLoading == false) {
      setItems(data.data.results);
    }
  }, [data, isLoading]);

  return (
    <>
      <HelmetFun title="People"/>
      <div className="movies_select basic_container">
        <div>
          <h3>Popular People</h3>
        </div>
        <div className="row">
          {items ? (
            items.map((item, ind) => (
              <div
                className="col-md-3 col-sm-6 mt-4 movies_item position-relative"
                key={ind}>
                <div>
                  <img
                    className="w-100 rounded-2"
                    src={`https://image.tmdb.org/t/p/w500${item.profile_path}`}
                    alt=""
                  />
                </div>
                <Link to={`/persondetails/${item.id}`} className="icon_youtube text-white">
                  <i className="fa-solid fa-eye fs-3"></i>
                </Link>
                <Link
                  to={`/persondetails/${item.id}`}
                  className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none">
                  <h4 className="mb-1">
                    {item.name}
                  </h4>
                  <section style={{width: "90%"}} className="d-inline-block mb-3">
                    {item.known_for.map((el,indd)=><span className="me-1 spanTitle" key={indd}>
                        {el.title}
                    </span>)}
                  </section>
                </Link>
              </div>
            ))
          ) : <Loading />}
        </div>
      
      
        
        <div className="row">
          {loadMorePeople ? (
            loadMorePeople.map((item, ind) => (
              <div
                className="col-md-3 col-sm-6 mt-4 movies_item position-relative"
                key={ind}>
                <div>
                  <img
                    className="w-100 rounded-2"
                    src={`https://image.tmdb.org/t/p/w500${item.profile_path}`}
                    alt=""
                  />
                </div>
                <Link to={`/persondetails/${item.id}`} className="icon_youtube text-white">
                  <i className="fa-solid fa-eye fs-3"></i>
                </Link>
                <Link
                  to={`/persondetails/${item.id}`}
                  className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none">
                  <h4 className="mb-1">
                    {item.name}
                  </h4>
                  <section style={{width: "90%"}} className="d-inline-block mb-3">
                    {item.known_for.map((el,indd)=><span className="me-1 spanTitle" key={indd}>
                        {el.title}
                    </span>)}
                  </section>
                </Link>
              </div>
            ))
          ) : loader ? <div className="d-flex justify-content-center align-items-center vh-100">
            <Loading />
          </div>
           : ""}
        </div>
      
        <button onClick={handleLoadMore} className="my-5 w-100 py-2 btn text-white btn_load_more">
          {moreLoader?<i className="fa-solid fa-spinner fa-spin text-white fs-3"></i>:"Load More"}
        </button> 
      
      </div>
    </>
  );
}
