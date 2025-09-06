import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../utils/cartSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_API } from "../utils/Contants";

const VegCard = (data) => {
  // the data is coming from feed component as props named data.item

  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState();
  const [toast, setToast] = useState(false);
  const userData = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const addVeggie = async (item) => {
    try {
      setLoading(true);
      const res = await axios.post(
        BACKEND_API + "/cart",
        {
          userId: userData._id,
          name: item.name,
          brand: item.brand,
          image: item.image,
          weight: item.quantity.defaultUnit,
          price: item.price.min,
          originalPrice: item.price.max,
          quantity: 1,
        },
        { withCredentials: true }
      );

      dispatch(addItem(item));
      setLoading(false);
    } catch (err) {
      setToast(true);
      setErrorMsg(err?.response?.data || "something wrong");
      setTimeout(() => {
        setToast(false);
      }, 2000);
      setLoading(false);
      console.error("Error adding item:", err);
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
      <div className="card bg-base-300 w-80 shadow-sm m-8">
        <figure>
          <img src={data.item.image} alt="Shoes" />
        </figure>
        <div className=" w-full m-1">
          <span className="bg-amber-200 rounded-4xl text-black text-xs absolute right-5 px-4 py-1 font-bold">
            {data?.item?.deliveryTime?.express}
          </span>
        </div>
        <div className="card-body">
          <h1 className="text-gray-400">{data.item.brand}</h1>
          <h2 className="card-title">{data.item.name}</h2>

          <p className="text-xs">
            Quantity: {data?.item?.quantity?.defaultUnit}
          </p>
          <p>
            <span className="text-lg">{"₹" + data?.item?.price?.min}</span>{" "}
            <span className="line-through text-xs">
              {data?.item?.price?.max}
            </span>
          </p>
          <div className="card-actions justify-end">
            <button
              onClick={() => addVeggie(data.item)}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VegCard;
