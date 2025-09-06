import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API } from "../utils/Contants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [email, setEmail] = useState("sruthi@gmail.com");
  const [password, setPassword] = useState("sruthi@123");
  const [errorMsg, setErrorMsg] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        BACKEND_API + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setLoading(false);
      setErrorMsg("");
      return navigate("/");
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.response?.data || "something wrong");


      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 2000);

      console.error(err);
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

    {
      toast && <div className="toast">
      <div className="alert alert-error">
        <span>{errorMsg}</span>
      </div>
    </div>

    }
      <div className="flex flex-col justify-center items-center m-auto mt-20 w-1/4 p-8 bg-base-300 rounded-4xl">
        <div className="my-2 w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-lg">Email Id:</legend>
            <input
              value={email}
              type="text"
              required
              className="input validator outline-none"
              placeholder=""
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </fieldset>
        </div>

        <div className="my-2 w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-lg">Password:</legend>
            <input
              value={password}
              type="password"
              className="input validator"
              required
              placeholder=" "
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </fieldset>
        </div>
        <div className="my-5 w-full">
          <button
            onClick={handlelogin}
            className="btn btn-secondary w-full text-lg"
          >
            Log In
          </button>
        </div>

        <div>
          <p>
            new user?
            <span className="underline cursor-pointer">
              <Link to={"/register"}> Register</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
