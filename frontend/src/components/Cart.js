import React from "react";
import { Button, Modal } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { STATICSERVICE } from "../constants";

import PropTypes from "prop-types";
import { useContext } from "react";
import { CartContext } from "../context/cart.js";

const Cart = ({ showModal, toggle }) => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } =
    useContext(CartContext);

  const notifyRemovedFromCart = (item) =>
    toast.error(`${item.title} removed from cart!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    });

  const notifyCartCleared = () =>
    toast.error(`Cart cleared!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    });

  const handleRemoveFromCart = (product) => {
    removeFromCart(product);
    notifyRemovedFromCart(product);
  };

  return (
    showModal && (
      <Modal isOpen={showModal} toggle={toggle} size="lg" style={{maxWidth: '700px', width: '100%'}}>
        <ToastContainer />
        <h1 className="text-2xl font-bold">Cart</h1>
        <div className="position-absolute right-16 top-10">
          <Button
            className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            onClick={toggle}
          >
            Close
          </Button>
        </div>
        <div className="d-flex flex-column gap-4">
          {cartItems.map((item) => (
            <div
              className="d-flex justify-content-between align-items-center"
              key={item.id}
            >
              <div className="d-flex gap-4">
                <img
                  src={STATICSERVICE + item.image || "./No_Image_Available.jpg"}
                  alt={item.title}
                  className="rounded-md w-24 h-24"
                  style={{
                    width: "20%",
                    objectFit: "fill",
                  }}
                />
                <div className="d-flex flex-column align-items-start">
                  <h1 className="text-lg font-bold mb-2">{item.title}</h1>
                  <p className="text-gray-600">Unit Price: ${item.price}</p>
                </div>
              </div>
              <div className="d-flex gap-4">
                <Button
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  onClick={() => {
                    addToCart(item);
                  }}
                >
                  +
                </Button>
                <p>{item.ordered_quantity}</p>
                <Button
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  onClick={() => {
                    const cartItem = cartItems.find(
                      (product) => product.id === item.id
                    );
                    if (cartItem.ordered_quantity === 1) {
                      handleRemoveFromCart(item);
                    } else {
                      removeFromCart(item);
                    }
                  }}
                >
                  -
                </Button>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length > 0 ? (
          <div className="d-flex flex-column justify-content-between align-items-center">
            <h1 className="text-lg font-bold">Total: ${getCartTotal()}</h1>
            <Button
              className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              onClick={() => {
                clearCart();
                notifyCartCleared();
              }}
            >
              Clear cart
            </Button>
          </div>
        ) : (
          <h1 className="text-lg font-bold">Your cart is empty</h1>
        )}
      </Modal>
    )
  );
};

Cart.propTypes = {
  showModal: PropTypes.bool,
  toggle: PropTypes.func,
};

export default Cart;
