import React, { useEffect, useState } from 'react'
import { getDatabase, ref, set, get, child , remove} from "firebase/database";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';
import "./profile.css";

export default function Profile() {
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  let userid = window.localStorage.getItem("userid");
  let [items , setItems] = useState(null);
  let [loveItems , setLoveItems] = useState(null);

  function getAllWatchList(){
    let arr = [];
    get(child(dbRef, `users/userAuth/${userid}/watchlist`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          for(let item in data){
            arr.push(data[item]);
          }
          console.log(arr);
          setItems(arr);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getAllLoveList(){
    let arr = [];
    get(child(dbRef, `users/userAuth/${userid}/lovelist`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          for(let item in data){
            arr.push(data[item]);
          }
          setLoveItems(arr);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function removeWatchlist(id,index){
    remove(ref(db, `users/userAuth/${userid}/watchlist/`+id))
    .then(res=>{
      toast.success("Movie is deleted successfully",{
        position: "top-right"
      });
      items.splice( index , 1);
      setItems(items);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  function removeLovelist(id,index){
    remove(ref(db, `users/userAuth/${userid}/lovelist/`+id))
    .then(res=>{
      toast.success("Movie is deleted successfully",{
        position: "top-right"
      });
      loveItems.splice( index , 1);
      setLoveItems(loveItems);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  useEffect(()=>{
    getAllWatchList();
    getAllLoveList();
  },[items , loveItems])

  return (
    <>
      <div className='basic_container mb-5' style={{marginTop: "150px"}}>
        <h2 className='mb-3'>MY WATCHLIST</h2>
        <div className='row'>
          {items?.length > 0? items.map((item,index)=><div key={index} className='col-md-3 mt-2 movies_item position-relative'>
              <div>
                <img
                  className="w-100"
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt=""
                />
              </div>
              <Link to={`/${item.itemdetails}/${item.movieId}`} className="icon_youtube">
                <i className="fa-brands fa-youtube"></i>
              </Link>
              <Link
                to={`/${item.itemdetails}/${item.movieId}`}
                className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
              >
                <div className="progress blue mb-3">
                  <span className="progress-left">
                    <span className="progress-bar"></span>
                  </span>
                  <span className="progress-right">
                    <span className="progress-bar"></span>
                  </span>
                  <div className="progress-value">
                    {item.vote.toFixed(1)}
                  </div>
                </div>
                <section className="mb-2">
                  {item.date}
                </section>
                <section className="mb-3">
                  {item.movieTitle.split(" ").slice(0, 4).join(" ")}
                </section>
              </Link>
              <button onClick={()=>removeWatchlist(item.movieId,index)} className='removeBtn btn btn-danger'>
                <i className="fa-regular fa-trash-can"></i>
              </button>
          </div>):<section style={{color: "#888"}}>No Items added to your wishlist yet...</section>}
        </div>

        <h2 className='mb-3 mt-5'>MY FAVORITES</h2>
        <div className='row'>
          {loveItems?.length > 0? loveItems.map((item,index)=><div key={index} className='col-md-3 mt-2 movies_item position-relative'>
              <div>
                <img
                  className="w-100"
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt=""
                />
              </div>
              <Link to={`/${item.itemdetails}/${item.movieId}`} className="icon_youtube">
                <i className="fa-brands fa-youtube"></i>
              </Link>
              <Link
                to={`/${item.itemdetails}/${item.movieId}`}
                className="content_movies flex-column justify-content-end d-flex align-items-start ps-3 text-white text-decoration-none"
              >
                <div className="progress blue mb-3">
                  <span className="progress-left">
                    <span className="progress-bar"></span>
                  </span>
                  <span className="progress-right">
                    <span className="progress-bar"></span>
                  </span>
                  <div className="progress-value">
                    {item.vote.toFixed(1)}
                  </div>
                </div>
                <section className="mb-2">
                  {item.date}
                </section>
                <section className="mb-3">
                  {item.movieTitle.split(" ").slice(0, 4).join(" ")}
                </section>
              </Link>
              <button onClick={()=>removeLovelist(item.movieId,index)} className='removeBtn btn btn-danger'>
                <i className="fa-regular fa-trash-can"></i>
              </button>
          </div>):<section style={{color: "#888"}}>No Items added to your favourites yet...</section>}
        </div>
      </div>
    </>
  )
}
