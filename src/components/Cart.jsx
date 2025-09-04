import { useState } from "react";
import mockData from "../data/mock_Data.json";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../utils/cartSlice";

const Cart = () => {
  //all the data is in cartData.items
  const cartData = useSelector((store) => store.cart);

  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});
  console.log(quantities);

  const increment = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  //calcutlating total price

  const cartTotal = cartData.items.reduce((acc, item) => {
    const count = quantities[item.id] || 1;
    return acc + item.price.min * count;
  }, 0);


  //deleting item from cart
  const deleteItem = (id) => {
    dispatch(removeItem(id));
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
  };

  if (cartData.items.length === 0) {
    return (
      <>
        <div className="flex flex-col flex-wrap justify-center items-center mt-20">
          <h1 className="text-3xl font-bold">Your Cart is Empty!</h1>
          <h2 className="text-xl mt-5">Add some items to your cart.</h2>
        </div>
      </>
    );
  }

  return (
    <div>
      {cartData.items.length > 0 &&
        cartData.items.map((item) => {
          const count = quantities[item.id] || 1; // default to 1
          const totalPrice = item?.price?.min * count;

          return (
            <>
              <div
                key={item.id}
                className="flex flex-col flex-wrap justify-center items-center mt-14"
              >
                <div className="card card-border bg-base-300 w-2/4 flex flex-row px-5 border-b-amber-400 rounded-lg  ">
                  <div className="flex flex-col my-2">
                    <figure>
                      <img src={item.image} alt="Shoes" />
                    </figure>

                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-circle btn-outline"
                        onClick={() => decrement(item?.id)}
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
                        onClick={() => increment(item?.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="card-body my-5">
                    <h1 className="text-gray-400">{item.brand}</h1>

                    <h2 className="card-title">{item.name}</h2>
                    <p className="text-xs">
                      Quantity: {item?.quantity?.defaultUnit}
                    </p>
                    <p>
                      <span className="text-lg">{"₹" + totalPrice}</span>{" "}
                      <span className="line-through text-xs">
                        {item?.price?.max}
                      </span>
                      <span className="line-through text-xs">{item?.id}</span>
                    </p>
                    <div className="card-actions justify-end">
                      <button
                        onClick={() => deleteItem(item?.id)}
                        className="btn btn-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}

      <div className="w-full flex flex-col justify-center items-center">
        <div className="mt-20 w-2/4 flex justify-between py-6 px-5 border border-amber-300 rounded-lg text-center items-center  mb-15">
          <p className="font-bold text-[#f4a04c] md:text-lg">Total: ₹{cartTotal}/-</p>
          <button className="bg-white shadow-xl rounded-lg p-3 mr-7 transition-all text-green-600 font-bold md:text-lg hover:scale-105">
            {" "}
            Place order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
