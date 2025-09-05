import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BACKEND_API } from "../utils/Contants";

const Register = () => {
  const [userName, setUserName] = useState("sruthi");
  const [email, setEmail] = useState("sruthi@gmail.com");
  const [password, setPassword] = useState("sruthi@123");
  const [errorMsg, setErrorMsg] = useState();

  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      const res = await axios.post(
        BACKEND_API + "/register",
        {
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );

      navigate("/");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err?.response?.data || "something wrong");

      console.error(err.message);
    }
  };

  return (
    <>
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
