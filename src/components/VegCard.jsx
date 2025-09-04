import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../utils/cartSlice";

const VegCard = (data) => {
  // the data is coming from feed component as props named data.item

  const dispatch = useDispatch();

  const addVeggie = (item) =>{
    dispatch(addItem(item));
  }

  return (
    <>
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
            onClick={() => (addVeggie(data.item))}
            className="btn btn-primary">Add</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VegCard;
