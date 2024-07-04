import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "../../firebase/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import toast from "react-hot-toast";
import { addToken } from "../../ReduxStore/userDataSlice";
import { useDispatch } from "react-redux";
import HelmetFun from "../Helmet/Helmet";

export default function Register() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [load,setLoad] = useState(false);


  function writeUserData(userId, name, email) {
    const db = getDatabase();
    set(ref(db, 'users/userAuth/' + userId), {
      username: name,
      email: email,
    });
    dispatch(addToken(userId));
    window.localStorage.setItem("userid" , userId);
    navigate("/home");
  }


  function submitUserDataToFirebase(values) {
    setLoad(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed up
        toast.success("Your account is added successfully");
        const user = userCredential.user;
        writeUserData(user.uid , values.username , values.email);
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorCode);
        alert(error.code);
      });
  }

  let RegPass = /^(?=.*[A-Z])(?=.*[1-9])(?=.*\W).{6,}$/;

  let validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Min Length of username is 3")
      .required("Username is required *"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required *"),
    password: Yup.string()
      .matches(
        RegPass,
        "Password must have at least one Uppercase, one digit, one Special character(/*!@#$%^&) and Min length is 6"
      )
      .required("Password is required *"),
  });

  let formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: submitUserDataToFirebase,
  });

  return (
    <>
      <HelmetFun title="Register"/>
      <div className="start_bg_img d-flex justify-content-center align-items-center">
        <div className="start_bg_img_overlay"></div>
        <form
          style={{ width: "550px" }}
          onSubmit={formik.handleSubmit}
          className="start_point_content bg_special p-5 py-4 rounded-3 m-auto "
        >
          <h2 className="title_bold mt-3 mb-4 h3 text-center">Sign Up</h2>
          <div className="mb-3 w-100">
            <label
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
              htmlFor="username"
              className="mb-1"
            >
              Username
            </label>
            <input
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              style={{ borderColor: "rgb(118, 118, 118)" }}
              className={`inpts_login ${
                formik.errors.username && formik.touched.username
                  ? "border border-danger"
                  : ""
              }`}
              name="username"
              id="username"
            />
            {formik.errors.username && formik.touched.username ? (
              <div className="handle_errors_login mt-2">
                {formik.errors.username}
              </div>
            ) : (
              ""
            )}
          </div>
      
          <div className="mb-3 w-100">
            <label
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
              htmlFor="email"
              className="mb-1"
            >
              Email
            </label>
            <input
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              style={{ borderColor: "rgb(118, 118, 118), " }}
              className={`inpts_login ${
                formik.errors.email && formik.touched.email
                  ? "border border-danger"
                  : ""
              }`}
              name="email"
              id="email"
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="handle_errors_login mt-2">
                {formik.errors.email}
              </div>
            ) : (
              ""
            )}
          </div>
      
          <div className="mb-3 w-100">
            <label
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
              htmlFor="password"
              className="mb-1"
            >
              Password
            </label>
            <input
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              style={{ borderColor: "rgb(118, 118, 118), " }}
              className={`inpts_login ${
                formik.errors.password && formik.touched.password
                  ? "border border-danger"
                  : ""
              }`}
              name="password"
              id="password"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="handle_errors_login mt-2">
                {formik.errors.password}
              </div>
            ) : (
              ""
            )}
          </div>
      
          <button type="submit"
            style={{ cursor: "pointer" }}
            disabled={formik.dirty && formik.isValid ? false : true}
            className="signinBtn mt-2 py-2 w-100"
          >
            {load? <i className="fa-solid fa-spinner fa-spin"></i>:"Register"}
          </button>
          <section style={{ color: "rgba(255,255,255,0.7)" }} className="mt-3">
            Are you have an account?{" "}
            <Link to="/login" className="nav-link d-inline-block text-decoration-underline ms-1 text-white">
              Login Now
            </Link>
          </section>
        </form>
      </div>
    </>
  );
}
