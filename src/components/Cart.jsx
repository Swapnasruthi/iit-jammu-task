import { useEffect, useState } from "react";
import mockData from "../data/mock_Data.json";
import { useDispatch, useSelector } from "react-redux";
import { addItem, clearCart, removeItem } from "../utils/cartSlice";
import axios from "axios";
import { BACKEND_API } from "../utils/Contants";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  //all the data is in cartData.items
  const cartData = useSelector((store) => store.cart);
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});
  const userId = userData?._id;

  useEffect(() => {
    if (userData?._id) {
      fetchCartItems();
    } else {
      navigate("/");
    }
  }, [userData]);

  //handling placeorder button click
  const placeOrder = async (req, res) => {
    try {
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

       // Convert response data (PDF) into a Blob
      const blob = new Blob([res.data], { type: "application/pdf" });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new browser tab

      window.open(url);


    } catch (err) {}
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(BACKEND_API + "/cart/" + userId, {
        withCredentials: true,
      });

      if (res) {
        const items = res.data;
        console.log("Fetched cart items:", items);
        //clear existing cart
        dispatch(clearCart());

        items.forEach((item) => dispatch(addItem(item)));
      }
    } catch (err) {
      console.log("Failed to fetch cart items" + err.message);
    }
  };

  const updateQuantity = async (item, newQuantity) => {
    try {
      const res = await axios.put(
        BACKEND_API + "/cart",
        {
          userId,
          name: item?.name,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      if (res) {
        fetchCartItems();
      }
    } catch (err) {
      console.log("Failed to update cart item" + err.message);
    }
  };
  const increment = (item) => {
    updateQuantity(item, (item.quantity || 1) + 1);
  };

  const decrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item, item.quantity - 1);
    }
  };

  // calculate total
  const cartTotal = cartData.items.reduce((acc, item) => {
    const count = item.quantity ?? 1;
    return acc + item.price * count;
  }, 0);

  //deleting item from cart
  const deleteItem = async (item) => {
    try {
      const res = await axios.delete(BACKEND_API + "/cart", {
        data: { userId, name: item.name },
        withCredentials: true,
      });

      dispatch(removeItem(item.id));
      fetchCartItems();
    } catch (err) {
      console.error("Error removing item:", err);
    }
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
    <div className="mt-36">
      {cartData.items.length > 0 &&
        cartData.items.map((item) => {
          // const count = quantities[item.id] || 1; // default to 1
          // const totalPrice = item?.price * count;

          const totalPrice = item.price * (item.quantity ?? 1);

          return (
            <>
              <div
                key={item.id}
                className="flex flex-col flex-wrap justify-center items-center mt-10"
              >
                <div className="card card-border bg-base-300 w-2/4 flex flex-row px-5 border-b-amber-400 rounded-lg  ">
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
                      <span className="line-through text-xs">{item?.id}</span>
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
            </>
          );
        })}

      <div className="w-full flex flex-col justify-center items-center">
        <div className="mt-20 w-2/4 flex justify-between py-6 px-5 border border-amber-300 rounded-lg text-center items-center  mb-15">
          <p className="font-bold text-[#f4a04c] md:text-lg">
            Total: ₹{cartTotal}/-
          </p>
          <button 
          onClick={()=> placeOrder()}
          className="bg-white shadow-xl rounded-lg p-3 mr-7 transition-all text-green-600 font-bold md:text-lg hover:scale-105">
            {" "}
            Place order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
