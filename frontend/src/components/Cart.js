import React, { useContext } from "react";
import { Button, Modal } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { CartContext } from "../context/cart.js";
import "../components/CartStyles.css"; 

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
    });

  const notifyCartCleared = () =>
    toast.error("Cart cleared!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  const handleRemoveFromCart = (product) => {
    removeFromCart(product);
    notifyRemovedFromCart(product);
  };

  return (
    showModal && (
      <Modal isOpen={showModal} toggle={toggle} className="cart-modal">
        <ToastContainer />
        <div className="modal-header">
          <h2 className="modal-title">Your Cart</h2>
          <Button className="modal-close-button" onClick={toggle} style={{ color: "red" }}>
            <span className="fa fa-times"></span>
          </Button>
        </div>
        <div className="modal-body">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image ? item.image : "./No_Image_Available.jpg"}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-price">Unit Price: ${item.price}</p>
                </div>
                <div className="cart-item-actions">
                  <Button
                    className="cart-item-action-button"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </Button>
                  <span className="cart-item-quantity">{item.quantity}</span>
                  <Button
                    className="cart-item-action-button"
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    -
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {cartItems.length > 0 ? (
            <div className="cart-total-section">
              <h2 className="cart-total-title">Total: ${getCartTotal()}</h2>
              <Button
                className="cart-clear-button"
                onClick={() => {
                  clearCart();
                  notifyCartCleared();
                }}
              >
                Clear Cart
              </Button>
            </div>
          ) : (
            <h3 className="cart-empty-message">Your cart is empty</h3>
          )}
        </div>
      </Modal>
    )
  );
};

Cart.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Cart;
