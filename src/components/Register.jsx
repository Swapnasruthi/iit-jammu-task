import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BACKEND_API } from "../utils/Contants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        BACKEND_API + "/register",
        {
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
      setErrorMsg("");
      setLoading(false);
    } catch (err) {
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setLoading(false);
      setTimeout(() => {
        setToast(false);
      }, 2000);

      console.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="text-white text-lg font-semibold animate-bounce">
            <span className="loading loading-ring loading-xl"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="toast">
          <div className="alert alert-error">
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center m-auto mt-20 w-1/4 p-8 bg-base-300 rounded-4xl">
        <div className="my-2 w-full ">
          <fieldset className="fieldset w-full ">
            <legend className="fieldset-legend text-lg">User Name:</legend>

            <input
              value={userName}
              type="text"
              className="input validator outline-none"
              required
              placeholder=""
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </fieldset>
        </div>

        <div className="my-2 w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-lg">Email Id:</legend>
            <input
              value={email}
              type="text"
              className="input validator outline-none"
              required
              placeholder=""
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </fieldset>
        </div>

        <div className="my-2 w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-lg">New Password:</legend>
            <input
              value={password}
              type="password"
              required
              className="input validator"
              placeholder=" "
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </fieldset>
        </div>
        <div className="my-5 w-full">
          <button
            onClick={() => {
              handleRegister();
            }}
            className="btn btn-secondary w-full text-lg"
          >
            Register
          </button>
        </div>

        <div>
          <p>
            already a user?{" "}
            <span className="underline cursor-pointer">
              <Link to={"/login"}> Login</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
