import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(userName);

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
              type="password "
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
          <button className="btn btn-secondary w-full text-lg">Register</button>
        </div>

        <div>
          <p>
            already a user?{" "}
            <span className="underline cursor-pointer"><Link to={"/login"}> Login</Link></span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
