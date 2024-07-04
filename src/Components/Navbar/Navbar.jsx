import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { addProfileImage, addToken } from "../../ReduxStore/userDataSlice";
import logo from "../../assets/imgs/logo2.png";
import { ProfileImgContext } from "../../Context/ProfileImage";

export default function Navbar() {
  let userid = window.localStorage.getItem("userid");
  let userImgLocal = window.localStorage.getItem("userImgLocal");
  let pathname = window.location.pathname;
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { token } = useSelector((store) => store.userData);
  let {profileImage , setProfileImage} = useContext(ProfileImgContext);

  let [navbarBg, setNavbarBg] = useState(null);
  let [image, setImage] = useState(null);
  let [bgLink, setBgLink] = useState(null);

  function addProfileImageReload() {
    if (localStorage.getItem("userImgLocal")) {
      setProfileImage(userImgLocal)
    }
  }

  function handleRefreshBgLink() {
    if (pathname == "/home") {
      setBgLink(1);
    } else if (pathname == "/movie") {
      setBgLink(2);
    } else if (pathname == "/tv") {
      setBgLink(3);
    } else if (pathname == "/people") {
      setBgLink(4);
    } else if (pathname == "/search") {
      setBgLink(5);
    }
  }

  useEffect(() => {
    dispatch(addToken(window.localStorage.getItem("userid")));
    addProfileImageReload();
    handleRefreshBgLink();
  }, [profileImage]);

  function handleLogout() {
    window.localStorage.removeItem("userid");
    window.localStorage.removeItem("userImgLocal");
    dispatch(addToken(""));
    dispatch(addProfileImage(""));
    setBgLink(1);
    navigate("/login");
  }

  function handleNavbar() {
    window.onscroll = (e) => {
      if (Math.floor(window.scrollY) > 30) {
        setNavbarBg("active");
      } else {
        setNavbarBg(null);
      }
    };
  }

  function addBgForLink(index) {
    setBgLink(index);
  }

  useEffect(() => {
    handleNavbar();
  }, []);

  return (
    <div className={`navFixed w-100 ${navbarBg ? "bg_black" : ""}`}>
      <div className={`basic_container`}>
        <nav className="navbar navbar-expand-lg d-flex justify-content-between w-100 py-2">
          <div className="container-fluid">
            <Link
              className="navbar-brand"
              onClick={() => setBgLink(1)}
              to="/home">
              <img src={logo} alt="Netflix logo" />
            </Link>

            <div className="profile_pic_handle">
            <Link
              to="/profile"
              onClick={() => setBgLink(null)}
              className="me-3 text-decoration-none"
            >
              {profileImage ? (
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #FFF",
                  }}
                  src={`${profileImage}`}
                  alt="profile"
                />
              ) : (
                "My Account"
              )}
            </Link>
            <button
              id="navBtn"
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>


            <div className="collapse navbar-collapse data_links" id="navbarSupportedContent">
            {token ? (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item active">
                  <Link
                    onClick={() => addBgForLink(1)}
                    to="/home"
                    className={`${bgLink == 1 ? "text-danger" : ""} nav-link`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(2)}
                    to="/movie"
                    className={`${bgLink == 2 ? "text-danger" : ""} nav-link`}
                  >
                    Movies
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(3)}
                    to="/tv"
                    className={`${bgLink == 3 ? "text-danger" : ""} nav-link`}
                  >
                    TV Shows
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(4)}
                    to="/people"
                    className={`${bgLink == 4 ? "text-danger" : ""} nav-link`}
                  >
                    People
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(5)}
                    to="/search"
                    className={`${bgLink == 5 ? "text-danger" : ""} nav-link`}
                  >
                    Search
                  </Link>
                </li>
              </ul>
            ) : (
              ""
            )}

            <div className="d-flex gap-3 signer align-items-center">
              {token ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setBgLink(null)}
                    className="ms-3 imager text-decoration-none"
                  >
                    {profileImage ? (
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "2px solid #FFF",
                        }}
                        src={`${profileImage}`}
                        alt="profile"
                      />
                    ) : (
                      "My Account"
                    )}
                  </Link>
                </>
              ) : (
                ""
              )}

              {token ? (
                <section>
                  <button onClick={handleLogout} className="signinBtn">
                    Sign out
                  </button>
                </section>
              ) : (
                <div className="position-absolute end-0">
                  <Link
                    to="/login"
                    onClick={() => setBgLink(null)}
                    className="ms-3"
                  >
                    <button type="submit" className="signinBtn">
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          </div>
        </nav>

        {/* <nav className="navbar navbar-expand-lg d-flex justify-content-between w-100 py-2">
          <Link
            className="navbar-brand"
            onClick={() => setBgLink(1)}
            to="/home"
          >
            <img src={logo} alt="Netflix logo" />
          </Link>
          <div className="profile_pic_handle">
            <Link
              to="/profile"
              onClick={() => setBgLink(null)}
              className="me-3 text-decoration-none"
            >
              {profileImage ? (
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #FFF",
                  }}
                  src={`${profileImage}`}
                  alt="profile"
                />
              ) : (
                "My Account"
              )}
            </Link>
            <button
              className="navbar-toggler"
              
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {token ? (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item active">
                  <Link
                    onClick={() => addBgForLink(1)}
                    to="/home"
                    className={`${bgLink == 1 ? "text-danger" : ""} nav-link`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(2)}
                    to="/movie"
                    className={`${bgLink == 2 ? "text-danger" : ""} nav-link`}
                  >
                    Movies
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(3)}
                    to="/tv"
                    className={`${bgLink == 3 ? "text-danger" : ""} nav-link`}
                  >
                    TV Shows
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(4)}
                    to="/people"
                    className={`${bgLink == 4 ? "text-danger" : ""} nav-link`}
                  >
                    People
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link
                    onClick={() => addBgForLink(5)}
                    to="/search"
                    className={`${bgLink == 5 ? "text-danger" : ""} nav-link`}
                  >
                    Search
                  </Link>
                </li>
              </ul>
            ) : (
              ""
            )}

            <div className="d-flex gap-3 align-items-center">
              {token ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setBgLink(null)}
                    className="ms-3 text-decoration-none"
                  >
                    {profileImage ? (
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "2px solid #FFF",
                        }}
                        src={`${profileImage}`}
                        alt="profile"
                      />
                    ) : (
                      "My Account"
                    )}
                  </Link>
                </>
              ) : (
                ""
              )}

              {token ? (
                <section>
                  <button onClick={handleLogout} className="signinBtn">
                    Sign out
                  </button>
                </section>
              ) : (
                <div className="position-absolute end-0">
                  <Link
                    to="/login"
                    onClick={() => setBgLink(null)}
                    className="ms-3"
                  >
                    <button type="submit" className="signinBtn">
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav> */}
      </div>
    </div>
  );
}
