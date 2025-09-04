import { useState } from "react";
import mockData from "../data/mock_Data.json";

const Cart = () => {
  console.log(mockData[0]);
  const item = mockData[1];

  const [count, setCount] = useState(1);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : 1));


  return (
    <>
      <div className="flex flex-col flex-wrap justify-center items-center mt-20">
        <div className="card card-border bg-base-300 w-2/4 flex flex-row px-5">
          <div className="flex flex-col my-5">

            <figure>
              <img src={item.image} alt="Shoes" />
            </figure>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-circle btn-outline"
                onClick={decrement}
                disabled={count === 1}
              >
                -
              </button>
              <input
                type="text"
                value={count}
                readOnly
                className="input input-bordered w-16 text-center"
              />
              <button
                className="btn btn-circle btn-outline"
                onClick={increment}
              >
                +
              </button>
            </div>

          </div>

          <div className="card-body my-5">
            <h1 className="text-gray-400">{item.brand}</h1>

            <h2 className="card-title">{item.name}</h2>
            <p className="text-xs">Quantity: {item?.quantity?.defaultUnit}</p>
            <p>
              <span className="text-lg">{"₹" + item?.price?.min}</span>{" "}
              <span className="line-through text-xs">{item?.price?.max}</span>
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-secondary">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
