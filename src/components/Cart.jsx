import { useEffect, useState } from "react";
import mockData from "../data/mock_Data.json";
import { useDispatch, useSelector } from "react-redux";
import { addItem, clearCart, removeItem } from "../utils/cartSlice";
import axios from "axios";
import { BACKEND_API } from "../utils/Contants";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cartData = useSelector((store) => store.cart);
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [toast, setToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // 👈 for confirmation dialog

  const userId = userData?._id;

  useEffect(() => {
    if (userData?._id) {
      fetchCartItems();
    } else {
      navigate("/");
    }
  }, [userData]);

  const placeOrder = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        BACKEND_API + "/orders/place",
        {
          items: cartData?.items,
          total: cartTotal,
          userEmail: userData?.email,
        },
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);

      setLoading(false);
    } catch (err) {
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setLoading(false);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BACKEND_API + "/cart/" + userId, {
        withCredentials: true,
      });

      if (res) {
        const items = res.data;
        dispatch(clearCart());
        items.forEach((item) => dispatch(addItem(item)));
      }

      setLoading(false);
    } catch (err) {
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setLoading(false);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const updateQuantity = async (item, newQuantity) => {
    try {
      setLoading(true);
      const res = await axios.put(
        BACKEND_API + "/cart",
        { userId, name: item?.name, quantity: newQuantity },
        { withCredentials: true }
      );
      if (res) fetchCartItems();
      setLoading(false);
    } catch (err) {
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setLoading(false);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const increment = (item) => updateQuantity(item, (item.quantity || 1) + 1);
  const decrement = (item) => {
    if (item.quantity > 1) updateQuantity(item, item.quantity - 1);
  };

  const cartTotal = cartData.items.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

  const deleteItem = async (item) => {
    try {
      setLoading(true);
      await axios.delete(BACKEND_API + "/cart", {
        data: { userId, name: item.name },
        withCredentials: true,
      });
      dispatch(removeItem(item.id));
      fetchCartItems();
      setLoading(false);
    } catch (err) {
      setErrorMsg(err?.response?.data || "something wrong");
      setToast(true);
      setLoading(false);
      setTimeout(() => setToast(false), 2000);
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

  if (cartData.items.length === 0) {
    return (
      <div className="flex flex-col flex-wrap justify-center items-center mt-20">
        <h1 className="text-3xl font-bold">Your Cart is Empty!</h1>
        <h2 className="text-xl mt-5">Add some items to your cart.</h2>
      </div>
    );
  }

  return (
    <div className="mt-36">
      {toast && (
        <div className="toast">
          <div className="alert alert-error">
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-96">
            <h2 className="text-xl text-black font-bold mb-4">
              Do you want to place the order?
            </h2>
            <div className="flex justify-center gap-6 mt-4">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowConfirm(false);
                  placeOrder();
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-error"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {cartData.items.map((item) => {
        const totalPrice = item.price * (item.quantity ?? 1);
        return (
          <div
            key={item.id}
            className="flex flex-col flex-wrap justify-center items-center mt-10"
          >
            <div className="card card-border bg-base-300 w-2/4 flex flex-row px-5 border-b-amber-400 rounded-lg">
              <div className="flex flex-col my-2">
                <figure>
                  <img src={item.image} alt="Shoes" />
                </figure>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => decrement(item)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={item?.quantity}
                    readOnly
                    className="input input-bordered w-16 text-center"
                  />
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => increment(item)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="card-body my-5">
                <h1 className="text-gray-400">{item.brand}</h1>
                <h2 className="card-title">{item.name}</h2>
                <p className="text-xs">Quantity: {item?.weight}</p>
                <p>
                  <span className="text-lg">{"₹" + totalPrice}</span>{" "}
                  <span className="line-through text-xs">
                    {item?.originalPrice}
                  </span>
                </p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => deleteItem(item)}
                    className="btn btn-secondary"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="w-full flex flex-col justify-center items-center">
        <div className="mt-20 w-2/4 flex justify-between py-6 px-5 border border-amber-300 rounded-lg text-center items-center mb-15">
          <p className="font-bold text-[#f4a04c] md:text-lg">
            Total: ₹{cartTotal}/-
          </p>
          <button
            onClick={() => setShowConfirm(true)} // 👈 opens confirmation dialog
            className="bg-white shadow-xl rounded-lg p-3 mr-7 transition-all text-green-600 font-bold md:text-lg hover:scale-105"
          >
            Place order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
