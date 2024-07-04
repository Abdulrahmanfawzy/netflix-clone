import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "../../firebase/firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { getDatabase, ref, set } from "firebase/database";
import toast from "react-hot-toast";
import { addProfileImage, addToken } from "../../ReduxStore/userDataSlice";
import { useDispatch } from "react-redux";
import HelmetFun from "../Helmet/Helmet";
import { ProfileImgContext } from "../../Context/ProfileImage";

export default function Login() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const auth = getAuth();
  let [load,setLoad] = useState(false);
  let {setProfileImage} = useContext(ProfileImgContext)

  function writeUserData(userId, name, email , profile_img) {
    const db = getDatabase();
    set(ref(db, "users/userAuth/" + userId), {
      username: name,
      email: email,
      profileImg: profile_img
    });
    window.localStorage.setItem("userid", userId);
    dispatch(addToken(userId));
    console.log(profile_img);
    dispatch(addProfileImage(profile_img));
    setProfileImage(profile_img)
    window.localStorage.setItem("userImgLocal" , profile_img)
    navigate("/home");
  }

  function handleLoginByGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(result.user.photoURL);
        writeUserData(user.uid, user.displayName, user.email , result.user.photoURL);
      })
      .catch((error) => {
        const errorCode = error.code;
        toast.error(errorCode);
        const email = error.customData.email;
        toast.error(email);
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(credential);
      });
  }

  function loginFun(email, password) {
    setLoad(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        toast.success("Welcome back!");
        window.localStorage.setItem("userid",user.uid);
        dispatch(addToken(user.uid));
        setLoad(false);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      })
      .catch((error) => {
        setLoad(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/invalid-credential") {
          toast.error("Email or password is not valid");
        }
      });
  }

  function submitUserDataToFirebase(values) {
    loginFun(values.email, values.password);
  }

  let RegPass = /^(?=.*[A-Z])(?=.*[1-9])(?=.*\W).{6,}$/;

  let validationSchema = Yup.object({
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
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: submitUserDataToFirebase,
  });

  return (
   <>
    <HelmetFun title="Login"/>
     <div className="start_bg_img d-flex justify-content-center align-items-center">
       <div className="start_bg_img_overlay"></div>
       <div
         style={{ width: "550px" }}
         className="start_point_content bg_special p-5 py-4 rounded-3 m-auto "
       >
         <h2 className="title_bold mt-3 mb-4 h3 text-center">
           Login To Your Account
         </h2>
         <section className="text-center">
           Welcome back! select method to login:
         </section>
         <div className="d-flex my-3 text-center gap-3 align-items-center">
           <section
             onClick={handleLoginByGoogle}
             style={{ cursor: "pointer" }}
             className="w-100 border border-light"
           >
             <img
               style={{ width: "24px", padding: "12px 0" }}
               className="me-2"
               src={require("../../assets/imgs/google.png")}
               alt="facebook logo"
             />
             Google
           </section>
         </div>
         <form onSubmit={formik.handleSubmit}>
           <section className="text-center continue_lines">
             Or continue with email
           </section>
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
    
           <button
             style={{ cursor: "pointer" }}
             disabled={formik.dirty && formik.isValid ? false : true}
             className="signinBtn mt-2 py-2 w-100">
               {load? <i className="fa-solid fa-spinner fa-spin"></i>:"Login"}
             
           </button>
           <section style={{ color: "rgba(255,255,255,0.7)" }} className="mt-3">
             Don't have an account?{" "}
             <Link
               to="/register"
               className="nav-link text-decoration-underline d-inline-block ms-1 text-white"
             >
               Register Now
             </Link>
           </section>
         </form>
       </div>
     </div>
   </>
  );
}
