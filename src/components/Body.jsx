import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_API } from "../utils/Contants";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("userData", userData);

  const fetchUser = async () => {
    if (userData) {
      return navigate("/");
    }
    try {
      const res = await axios.get(BACKEND_API + "/getUser", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      navigate("/login");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  },[]);

  
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Body;
