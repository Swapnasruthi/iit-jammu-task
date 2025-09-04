import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
     <>
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
              type="password "
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
          <button className="btn btn-secondary w-full text-lg">Log In</button>
        </div>

        <div>
          <p>
            new user?
            <span className="underline cursor-pointer"><Link to={"/register"}> Register</Link></span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
