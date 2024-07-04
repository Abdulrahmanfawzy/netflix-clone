import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import StartPoint from "./Components/StartPoint/StartPoint";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./ReduxStore/ReduxStore";
import { QueryClient, QueryClientProvider } from "react-query";
import ApiContext from "./Context/ApiContext";
import MoviesContextProvider from "./Context/movies";
import Movie from "./Components/Movie/Movie";
import Tv from "./Components/Tv/Tv";
import People from "./Components/People/People";
import MovieDetails from "./Components/MovieDetails/MovieDetails";
import TvDetails from "./Components/TvDetails/TvDetails";
import PersonDetails from "./Components/PersonDetails/PersonDetails";
import Search from "./Components/Search/Search";
import Profile from "./Components/Profile/Profile";
import ProtectedComponent from "./Components/ProtectedComponent/ProtectedComponent";
import RecommendItem from "./Components/getRecommend/RecommendItem";
import ProfileImageProvider from "./Context/ProfileImage";

let queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <ProfileImageProvider>
        <MoviesContextProvider>
          <ApiContext>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedComponent>
                        <StartPoint />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/recommenditem/:recommendItem/:type"
                    element={
                      <ProtectedComponent>
                        <RecommendItem />
                      </ProtectedComponent>
                    }
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/home"
                    element={
                      <ProtectedComponent>
                        <Home />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/movie"
                    element={
                      <ProtectedComponent>
                        <Movie />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/tv"
                    element={
                      <ProtectedComponent>
                        <Tv />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/people"
                    element={
                      <ProtectedComponent>
                        <People />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedComponent>
                        <Search />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedComponent>
                        <Profile />
                      </ProtectedComponent>
                    }
                  />
                  <Route
                    path="/moviedetails/:movieId"
                    element={<MovieDetails />}
                  />
                  <Route path="/tvdetails/:tvId" element={<TvDetails />} />
                  <Route
                    path="/netflix-clone/persondetails/:personId"
                    element={<PersonDetails />}
                  />
                  <Route path="*" element={
                    <div className="vh-100 flex-column d-flex justify-content-center align-items-center">
                      <h1 style={{fontSize: "7rem"}}>404</h1>
                      <h5>Not found page</h5>
                    </div>
                    } />
                </Routes>
              </BrowserRouter>
            </QueryClientProvider>
          </ApiContext>
        </MoviesContextProvider>
      </ProfileImageProvider>
      <Toaster />
    </Provider>
  );
}
