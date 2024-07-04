import axios from "axios";
import { createContext } from "react";
import React from 'react'

export let ApiSliderContext = createContext();
let api = "287dd5b83b76126e8aea120f83f6345a";

export default function ApiContext({children}) {

    function getDataForAll(endPoint){
        return axios.get(`https://api.themoviedb.org/3/${endPoint}?api_key=${api}`)
        .then(res=>res)
        .catch(err=>err);
    }

  return (
    <ApiSliderContext.Provider value={{getDataForAll}}>
        {children}
    </ApiSliderContext.Provider>
  )
}
