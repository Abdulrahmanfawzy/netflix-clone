import axios from "axios";
import React from "react";
import { createContext } from "react";

export let moviesApi = createContext();
let api = "287dd5b83b76126e8aea120f83f6345a";

export default function MoviesContextProvider({ children }) {

  function getAllGenres(endPoint) {
    return axios
      .get(`https://api.themoviedb.org/3/${endPoint}?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }
  function getAllMoviesForHome(endPoint , page) {
    return axios
      .get(`https://api.themoviedb.org/3/${endPoint}?api_key=${api}&page=${page}`)
      .then((res) => res)
      .catch((err) => err);
  }
  function getAllMovies(endPoint , genre , page) {
    return axios
      .get(`https://api.themoviedb.org/3/${endPoint}?api_key=${api}&with_genres=${genre}&page=${page}`)
      .then((res) => res)
      .catch((err) => err);
  }
  function getAllPeople(endPoint , page) {
    return axios
      .get(`https://api.themoviedb.org/3/${endPoint}?api_key=${api}&page=${page}`)
      .then((res) => res)
      .catch((err) => err);
  }

  function getAllCastMovie(endPoint) {
    return axios
      .get(`https://api.themoviedb.org/3/${endPoint}/credits?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }

  function getVideosOfMovie(endPoint) {
    return axios
      .get(`https://api.themoviedb.org/3/${endPoint}/videos?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }

  function getPostersOfMovie(endPoint) {
    return axios 
      .get(`https://api.themoviedb.org/3/${endPoint}/images?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }

  function getRecommendationOfMovie(endPoint) {
    return axios  
      .get(`https://api.themoviedb.org/3/${endPoint}/recommendations?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }


  function getMovieDetails(id) {
    return axios
      .get(`https://api.themoviedb.org/3/${id}?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }

  function getMovieForPerson(id) {
    return axios
      .get(`https://api.themoviedb.org/3/${id}/movie_credits?api_key=${api}`)
      .then((res) => res)
      .catch((err) => err);
  }

  function searchFun(type , val) {
    return axios // https://api.themoviedb.org/3/search/movie?query=a
      .get(`https://api.themoviedb.org/3/search/${type}?api_key=${api}&query=${val}`)
      .then((res) => res)
      .catch((err) => err);
  }



  return <moviesApi.Provider value={{searchFun,getMovieForPerson,getRecommendationOfMovie,getPostersOfMovie,getVideosOfMovie,getAllCastMovie,getAllMoviesForHome,getMovieDetails,getAllPeople,getAllMovies,getAllGenres}}>
    {children}
    </moviesApi.Provider>;
}
