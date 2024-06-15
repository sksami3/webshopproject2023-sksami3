import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import { USERITEMSERVICE } from "../constants.js";
import AuthService from "../services/AuthService.js";
import "../../src/cartStyles.css"; 

export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loggedInUser, setloggedInUser] = useState(null);

  useEffect(() => {
    async function fetchUserAndCartItems() {
      const user = AuthService.getUserFromToken();
      setloggedInUser(user); 

      // We need to use the user directly since state updates are asynchronous
      if (user && user.userId) {
        try {
          const response = await fetch(
            USERITEMSERVICE + "/byUser/" + user.userId
          );
          const data = await response.json();
          setCartItems(
            data.map((item) => ({
              ...item.item,
              ordered_quantity: item.ordered_quantity,
            }))
          );
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    }

    fetchUserAndCartItems();
  }, []);

  const addToCart = async (newItem) => {
    setCartItems((currentCartItems) => {
      const existingItemIndex = currentCartItems.findIndex(
        (item) => item.id === newItem.id
      );

      // Calculate the new or updated quantity
      const newQuantity =
        existingItemIndex >= 0
          ? currentCartItems[existingItemIndex].ordered_quantity + 1
          : 1;

      // Update the cart items state
      const updatedCartItems =
        existingItemIndex >= 0
          ? currentCartItems.map((item, index) =>
              index === existingItemIndex
                ? { ...item, ordered_quantity: newQuantity }
                : item
            )
          : [
              ...currentCartItems,
              { ...newItem, ordered_quantity: newQuantity },
            ];

      // Call to update the backend
      updateCartInBackend(newItem, existingItemIndex >= 0, newQuantity);

      return updatedCartItems;
    });
  };

  // Function to handle backend update
  const updateCartInBackend = async (newItem, isUpdate, currentQuantity) => {
    const method = isUpdate ? "PUT" : "POST";
    const url = `${USERITEMSERVICE}/` + (isUpdate ? `${newItem.id}` : "");

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: loggedInUser.userId,
          item: newItem.id,
          ordered_quantity: currentQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      const responseData = await response.json();
      console.log("Cart updated:", responseData);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = (itemToRemove) => {
    const existingItem = cartItems.find((item) => item.id === itemToRemove.id);
    if (existingItem.ordered_quantity > 1) {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemToRemove.id
          ? { ...item, ordered_quantity: item.ordered_quantity - 1 }
          : item
      );
      setCartItems(updatedCartItems);
      fetch(USERITEMSERVICE + `/${itemToRemove.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: loggedInUser.userId,
          item: itemToRemove.id,
          ordered_quantity: existingItem.ordered_quantity - 1,
        }),
      });
    } else {
      const updatedCartItems = cartItems.filter(
        (item) => item.id !== itemToRemove.id
      );
      setCartItems(updatedCartItems);
      fetch(USERITEMSERVICE + `/deleteUnpurchasedItem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: loggedInUser.userId,
          item: itemToRemove.id
        }),
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // Assuming your API endpoint supports a bulk delete or clear operation
    fetch(USERITEMSERVICE + "/deleteUnpurchasedItems", {
      method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: loggedInUser.userId,
        }),
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.ordered_quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
