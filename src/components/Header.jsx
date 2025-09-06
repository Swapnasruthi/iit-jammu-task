import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BACKEND_API } from "../utils/Contants";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../utils/cartSlice";
import { removeUser } from "../utils/userSlice";

const Header = () => {
  const cartData = useSelector((store) => store.cart);
  const [cartLength, setCartLength] = useState(cartData?.items?.length || 0);
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const userId = userData?._id;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(); 
  const [toast, setToast] = useState(false);
  

  const logout = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        BACKEND_API + "/logout",
        {},
        { withCredentials: true }
      );
      setLoading(false);

      if (res.status === 200) {
        console.log("Logout successful:", res.data.message);
        dispatch(clearCart());
        dispatch(removeUser());
        navigate("/login");
      } else {
        console.log("Unexpected response:", res);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 2000);
      console.log("error while log outing");
    }
  };
  const fetchCartItems = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(BACKEND_API + "/cart/" + userId, {
        withCredentials: true,
      });
      if (res) {
        const items = res.data;
        setCartLength(items.length);
      }
    } catch (err) {
      console.log("Failed to fetch cart items" + err.message);
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
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, cartData]);

  return (
    <>
      {toast && (
        <div className="toast">
          <div className="alert alert-error">
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
      <div className="navbar bg-base-100 shadow-xl px-10 fixed top-0 left-0 w-full z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            <span>
              <Link to={"/"}>VegKart</Link>
            </span>
          </a>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end mr-5">
            {userData && (
              <Link to={"/cart"}>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle"
                >
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />{" "}
                    </svg>

                    <span className="badge badge-sm indicator-item">
                      {cartLength}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {userData && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={userData?.userPhoto}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between text-lg">
                    Hello, {userData.userName}
                  </a>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
