import React, { useEffect, useState } from "react";
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
  const [toast, setToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const [loading, setLoading] = useState(true);

  console.log("userData", userData);

  const fetchUser = async () => {
    if (userData) {
      setLoading(false);
      return navigate("/");
    }
    else{
      setLoading(false);
      return navigate("/login");
    }
    try {
      const res = await axios.get(BACKEND_API + "/getUser", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      navigate("/login");
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 2000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
      <Header />
      <Outlet />
    </>
  );
};

export default Body;
