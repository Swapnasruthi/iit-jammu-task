const express = require("express");
const cookieParser = require("cookie-parser");
const CartItem = require("../model/cartItem");
const { userAuth } = require("../middleware/auth");
const cartRouter = express.Router();

cartRouter.use(cookieParser());
cartRouter.use(express.json()); // to read json data from the db

//to Add a item in to the cart
cartRouter.post("/cart", userAuth, async (req, res) => {
  try {
    const {
      userId,
      name,
      brand,
      image,
      weight,
      quantity,
      price,
      originalPrice,
    } = req.body;

    // check if item already exists for this user (based on name or unique product property)
    let existingItem = await CartItem.findOne({ userId, name });

    if (existingItem) {
      // increment the quantity
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json({
        message: "Quantity updated",
        item: existingItem,
      });
    }

    // if not in cart, create new entry
    const newCartItem = new CartItem({
      userId,
      name,
      brand,
      image,
      weight,
      quantity: quantity || 1, // default to 1
      price,
      originalPrice,
    });

    await newCartItem.save();
    res.status(201).json({
      message: "Item added to cart",
      item: newCartItem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all cart items for a user
cartRouter.get("/cart/:userId", userAuth, async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update quantity of a specific cart item
cartRouter.put("/cart", userAuth, async (req, res) => {
  try {
    const { userId, name, quantity } = req.body;

    const updatedItem = await CartItem.findOneAndUpdate(
      { userId, name },               // search condition
      { $set: { quantity: Number(quantity) } },  // update
      { new: true }                   // return updated doc
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found for this user" });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Delete a specific cart item
cartRouter.delete("/cart", userAuth, async (req, res) => {
  try {
    const { userId, name } = req.body;

    const deletedItem = await CartItem.findOneAndDelete({ userId, name });

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found for this user" });
    }

    res.status(200).json({ message: "Item removed", item: deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = cartRouter;