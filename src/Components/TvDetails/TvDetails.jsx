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
import { getDatabase, ref, set, get, child , remove} from "firebase/database";
import toast from "react-hot-toast";
import Progress from "../Progress/Progress";
import LazyLoad from "react-lazyload";
import HelmetFun from "../Helmet/Helmet";

export default function TvDetails() {
  let { tvId } = useParams();
  let {
    getRecommendationOfMovie,
    getPostersOfMovie,
    getVideosOfMovie,
    getMovieDetails,
    getAllCastMovie,
  } = useContext(moviesApi);
  let [items, setItems] = useState(null);
  let [cast, setCast] = useState(null);
  let [video, setVideo] = useState(null);
  let [posters, setPosters] = useState(null);
  let [recommendations, setRecommendations] = useState(null);
  let [username, setUsername] = useState(null);
  let [val, setVal] = useState('');
  let [allReviews, setAllReviews] = useState(null);
  let [moreLoader, setMoreLoader] = useState(false);
  let [count, setCount] = useState(3);
  let [reviewTitle, setReviewTitle] = useState(null);
  let [loadMoreBtn, setLoadMoreBtn] = useState(false);
  let [watchChecked , setWatchChecked] = useState(false);
  let [image, setImage] = useState(null);
  let userImgLocal = window.localStorage.getItem("userImgLocal");


  const db = getDatabase();
  const dbRef = ref(getDatabase());
  let colors = ["#512DA7" , "#3F86A4" , "#C2175B" , "#679F36" , "#679F36"]
  let userid = window.localStorage.getItem("userid");

  function getAllWatchList(){
    get(child(dbRef, `users/userAuth/${userid}/watchlist`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val()
        for(let item in data){
          if(data[item].movieId == tvId){
            setWatchChecked(true)
          }
        }
      }
    })
  }

  useEffect(()=>{
    getAllWatchList()
  },[watchChecked])


  async function handleMovieDisplay(id){
    getMovieById(id);
    getAllCast(id);
    getAllVideos(id);
    getAllPosters(id);
    getAllRecommendation(id);
  }

  async function getMovieById(id) {
    let { data } = await getMovieDetails(`tv/${id}`);
    setItems(data);
  }

  async function getAllCast() {
    let { data } = await getAllCastMovie(`tv/${tvId}`);
    setCast(data.cast);
  }

  async function getAllVideos() {
    let { data } = await getVideosOfMovie(`tv/${tvId}`);
    setVideo(data.results);
  }

  async function getAllPosters() {
    let arr = [];
    let { data } = await getPostersOfMovie(`tv/${tvId}`);

    if (data?.posters) {
      for (let i = 0; i < 10; i++) {
        arr.push(data.posters[i]);
      }
      setPosters(arr);
    }
  }

  async function getAllRecommendation() {
    let arr = [];
    let { data } = await getRecommendationOfMovie(`tv/${tvId}`);
    if (data) {
      setRecommendations(data.results);
    }
    console.log(data.results);
  }

  function getNameFun() {
    get(child(dbRef, `users/userAuth/${userid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val().username);
          setImage(snapshot.val().profileImg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getValFun(e) {
    setVal(e.target.value);
  }

  function addReviewFun() {
    if (!val) {
      toast.error("Write your review please!");
    } else {
      set(ref(db, `users/reviews/${tvId}/` + Date.now()), {
        username: username,
        createdAt: Date.now(),
        review: val,
        userid: userid,
        reviewId: Date.now(),
        userImage: userImgLocal,
      })
      .then((res) => {
        getAllReviews();
        setCount(3);
        setVal('');
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  function getAllReviews() {
    let arr = [];
    let newArr = [];
    let secondArr = []
    get(child(dbRef, `users/reviews/${tvId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          for (const item in data) {
            arr.push(data[item]);
          }
          let reverseArr = [...arr].reverse();
          setReviewTitle(reverseArr);

          for (let i = 0; i < count; i++) {
            if (count < arr.length) {
              newArr.push(arr[i]);
              secondArr = [...newArr].reverse();
              setAllReviews(secondArr);
              setLoadMoreBtn(false);
            } else {
              setAllReviews(reverseArr);
              setLoadMoreBtn(true);
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function timeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else if (weeks > 0) {
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return seconds === 1 ? "1 second ago" : `a few seconds ago`;
    }
  }


  function removeReview(review_id , index){
    let newArr = allReviews.splice(index ,1);
    remove(ref(db, `users/reviews/${tvId}/`+review_id))
    .then(res=>{
      toast.success("your review is deleted successfully");
      setAllReviews(allReviews);
      setReviewTitle(reviewTitle - 1);
      getAllReviews();
      setCount(3);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  useEffect(() => {
    getNameFun();
    getAllReviews();
  }, [allReviews, count , username]);

  

  async function handleLoadMore() {
    setMoreLoader(true);
    setCount(count + 3);
    setMoreLoader(false);
  }

  function watchlistFun(id,movieTitle, poster , vote , date){
    setWatchChecked(true);
    set(ref(db, `users/userAuth/${userid}/watchlist/` + id), {
      userid: userid,
      movieId: id,
      movieTitle: movieTitle,
      poster: poster,
      date: date.split("-")[0],
      vote: vote,
      itemdetails: "tvdetails"
    })
    .then((res) => {
      toast.success(`${movieTitle} Series has been added successfully`);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  

  useEffect(() => {
    getMovieById(tvId);
    getAllCast(tvId);
    getAllVideos(tvId);
    getAllPosters(tvId);
    getAllRecommendation(tvId);
  }, [tvId]);
  return (
    <>
      <HelmetFun title={items?items.name : "Tv series"}/>
      {items ? (
        <>
          <div
            className="backPath position-relative"
            style={{
              backgroundImage: `linear-gradient(to top, rgb(0, 0, 0) 15%, rgba(0, 0, 0, 0)) ,url(https://image.tmdb.org/t/p/original${items.backdrop_path})`,
            }}
          >
            <div className="overlay_backdrop"></div>
            <div className="content_overlay_top_bot"></div>

          </div>

          <div className="basic_container allPage">
            <div className="row">
              <div className="col-md-5">
                <div className="mb-3">
                  <img
                    className="d-block w-100 rounded-1"
                    src={`https://image.tmdb.org/t/p/w500${items.poster_path}`}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-md-7">
                <h2 className="title_movie">{items.name}</h2>
                <h2 className="title_movie mb-3">
                  {items.first_air_date.split("-")[0]}
                </h2>
                <div className="d-flex align-items-center">
                <div className="me-2">
                  <Progress vote={items.vote_average.toFixed(1)}/>
                </div>
                {items.genres.map((genre, index) => (
                  <section className="genre_name" key={index}>
                    {genre.name}
                  </section>
                ))}
                </div>

                <div className="my-4 overview">{items.overview}</div>

                <div className="d-flex gap-4 align-items-center">
                  <div className="love" style={{ cursor: "pointer" }}>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <div>
                    <button
                      onClick={()=>watchlistFun(items.id , items.name , items.poster_path , items.vote_average , items.first_air_date)}
                      style={{ padding: "12px 20px" }}
                      className="watch_link text-white text-decoration-none border d-inline-block rounded-1"
                      >
                      {watchChecked? <i className="fa-solid fa-check"></i> 
                      :<i className="fa-solid fa-plus"></i>
                       }
                       Watch List
                    </button>
                  </div>
                </div>

                <div className="cast my-4">
                  <h2 className="cast_title mb-4">CAST</h2>
                  <Swiper
                    pagination={{
                      dynamicBullets: true,
                    }}
                    modules={[Pagination]}
                    slidesPerView={2}
                    spaceBetween={10}
                    breakpoints={{
                      400: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      640: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                      },
                      992: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                      },
                      1024: {
                        slidesPerView: 5,
                        spaceBetween: 10,
                      },
                    }}
                    className="mySwiper"
                  >
                    {cast?.length > 0
                      ? cast.map((person, index) => (
                          <SwiperSlide
                            className="position-relative"
                            style={{ cursor: "grab" }}
                            key={index}
                          >
                            <Link to={`/persondetails/${person.id}`}>
                              <img
                                className="d-block"
                                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                alt=""
                              />
                            </Link>
                            <h5 className="cast_name">{person.name}</h5>
                          </SwiperSlide>
                        ))
                      : "No Cast Found"}
                  </Swiper>
                </div>
              </div>
            </div>

            <div className="videos my-5">
              <h2 className="cast_title mb-4">VIDEOS</h2>
              <Swiper
                navigation={true}
                modules={[Navigation]}
                slidesPerView={1}
                spaceBetween={10}
                className="mySwiper"
              >
                {video?.length > 0
                  ? video.map((itm, index) => (
                      <SwiperSlide className="position-relative" key={index}>
                        <div className="video-responsive">
                        <LazyLoad height={650} offset={100} once>
                          <iframe
                            width="100%"
                            height="650"
                            src={`https://www.youtube.com/embed/${itm.key}`}
                            allowFullScreen
                          ></iframe>
                        </LazyLoad>
                        </div>
                      </SwiperSlide>
                    ))
                  : "No Videos founded"}
              </Swiper>
            </div>

             <div className="posters my-5">
              <h2 className="cast_title mb-4">POSTERS</h2>
              <Swiper
                slidesPerView={2}
                spaceBetween={10}
                breakpoints={{
                  400: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                  },
                }}
                className="mySwiper"
              >
                {posters?.length > 0
                  ? posters.map((poster, index) => (
                      <SwiperSlide style={{ cursor: "grab" }} key={index}>
                        <div>
                          <img
                            className="w-100 d-block"
                            src={`https://image.tmdb.org/t/p/w500${poster?.file_path}`}
                            alt=""
                          />
                        </div>
                      </SwiperSlide>
                    ))
                  : "No Posters founded"}
              </Swiper>
            </div>

            <div
              style={{ borderTop: "1px solid #333" }}
              className="review pt-4 mt-5"
            >
              <h3 className="cast_title mb-5">Reviews ({reviewTitle?.length?reviewTitle?.length:0})</h3>

              {allReviews?.length > 0
                ? allReviews.map((item, index) => (
                    <div key={index} className="d-flex gap-3 mt-4">
                      {item.userImage?
                        <img style={{width: "40px", height: "40px", borderRadius: "50%" , border: "2px solid #FFF"}} 
                        src={`${item.userImage}`} alt="profile" />
                      :<section style={{background: colors[index*.5]}} className="profile_letter text-white">
                      {item.username?.split("")[0]}
                    </section>}
                      <div className="w-100 d-flex justify-content-between">
                        <div>
                          <h6 className="mb-1">{item.username}</h6>
                          <section
                            style={{ color: "#777", fontSize: "14px" }}
                            className="mb-2"
                          >
                            {timeAgo(item.createdAt)}
                          </section>
                          <section>{item.review}</section>
                        </div>
                        {userid == item.userid ?
                          <div>
                          <button
                            onClick={()=>removeReview(item.reviewId,index)}
                            style={{ padding: "8px 12px" , fontSize: "13px" }}
                            className="watch_link text-white border d-inline-block rounded-1"
                          >
                            <i className="fa-solid fa-trash-can m-0"></i> 
                          </button>
                        </div>
                        : ""
                        }
                        
                      </div>
                    </div>
                  ))
                : ""}
              {reviewTitle?.length > 3 ? 
              <>
                  {loadMoreBtn ? 
                    <button className="w-100 mt-3 py-2 btn text-white btn_load_more">
                      {moreLoader ? (
                        <i className="fa-solid fa-spinner fa-spin text-white fs-3"></i>
                      ) : (
                        "No More"
                      )}
                    </button>
                   : 
                    <button
                      onClick={handleLoadMore}
                      className="w-100 mt-3 py-2 btn text-white btn_load_more"
                    >
                      {moreLoader ? (
                        <i className="fa-solid fa-spinner fa-spin text-white fs-3"></i>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  }
              </>
              
              : ""}

              <div
                style={{ borderTop: "1px solid #333" }}
                className="d-flex gap-3 pt-5 mt-5"
              >
                {image?
                  <img style={{width: "40px", height: "40px", borderRadius: "50%" , border: "2px solid #FFF"}} 
                  src={`${image}`} alt="profile" />
                :<section className="profile_letter">
                {username?.split("")[0]}
              </section>}
                <div className="w-100">
                  <h5 className="mb-0">{username}</h5>
                  <textarea value={val}
                    onChange={(e) => getValFun(e)}
                    placeholder="Write your review"
                    className="write_review"
                  ></textarea>
                  <button
                    onClick={addReviewFun}
                    style={{ padding: "8px 20px" }}
                    className="watch_link mt-2 text-white border d-inline-block rounded-1"
                  >
                    <img
                      style={{ width: "17px", marginTop: "-3px" }}
                      src={require("../../assets/imgs/message.png")}
                      alt=""
                    />{" "}
                    Post
                  </button>
                </div>
              </div>
            </div>

            <div className="recommendations my-5">
              <h2 className="cast_title mb-4">Recommendation</h2>
              
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
                {recommendations?.length > 0
                  ? recommendations.map((item, index) => (
                      <SwiperSlide
                        className="movies_item position-relative"
                        key={index}
                      >
                        <div>
                          <img className="w-100"
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt=""
                          />
                        </div>
                        <Link onClick={()=>handleMovieDisplay(item.id)}
                          to={`/recommenditem/${item.id}/tvdetails`}
                          className="icon_youtube"
                        >
                          <i className="fa-brands fa-youtube"></i>
                        </Link>
                        <Link onClick={()=>handleMovieDisplay(item.id)}
                          to={`/recommenditem/${item.id}/tvdetails`}
                          className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
                        >
                          <div className="mb-2">
                            <Progress vote={items.vote_average.toFixed(1)}/>
                          </div>
                          <section className="mb-2">
                            {item.first_air_date.split("-")[0]}
                          </section>
                          <section className="mb-3">
                            {item.name.split(" ").slice(0, 4).join(" ")}
                          </section>
                        </Link>
                      </SwiperSlide>
                    ))
                  : "No Recommendations found"}
              </Swiper>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
