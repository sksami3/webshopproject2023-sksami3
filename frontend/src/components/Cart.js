import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { STATICSERVICE } from "../constants";
import { USERITEMSERVICE } from "../constants";
import PropTypes from "prop-types";
import { CartContext } from "../context/cart.js";
import AuthService from "../services/AuthService.js";
// import "../components/CartStyles.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Cart = ({ showModal, toggle }) => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } =
    useContext(CartContext);
  const [loggedInUser, setloggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getUserFromToken();
    setloggedInUser(user);
  }, []);

  const notify = (message, type = "success") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

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

  const checkPriceUpdates = async () => {
    try {
      const response = await fetch(USERITEMSERVICE + "/checkPriceUpdates/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: loggedInUser.userId,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error during price update check:", error);
      notify("Failed to check price updates.", "error");
      return false;
    }
  };

  const handlePurchase = async () => {
    const updatedPriceList = await checkPriceUpdates();
    if (!updatedPriceList.result) {
      purchase(loggedInUser, clearCart, notify);
    } else {
      var message = generatePriceUpdateMessage(updatedPriceList);
      message += " Would you like to proceed?";
      Swal.fire({
        title: "Price Update",
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          purchase(loggedInUser, clearCart, notify, navigate);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      // notify(message, "error");
    }
  };

  return (
    showModal && (
      <Modal isOpen={showModal} toggle={toggle} className="cart-modal">
        <ToastContainer />
        <div className="modal-header">
          <h2 className="modal-title">Your Cart</h2>
          <Button
            className="modal-close-button"
            onClick={toggle}
            style={{ color: "red" }}
          >
            <span className="fa fa-times"></span>
          </Button>
        </div>
        <div className="modal-body">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={
                    item.image
                      ? STATICSERVICE + item.image
                      : process.env.PUBLIC_URL + "/No_Image_Available.jpg"
                  }
                  alt={item.title}
                  className="rounded-md w-24 h-24"
                  style={{
                    width: "20%",
                    objectFit: "fill",
                  }}
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-price">Unit Price: ${item.price}</p>
                  <h3
                    className="cart-item-title"
                    style={{
                      color:
                        item.ordered_quantity > item.quantity
                          ? "red"
                          : "inherit",
                    }}
                  >
                    Available Quantity: {item.quantity}
                  </h3>
                </div>
                <div className="cart-item-actions">
                  <Button
                    className="cart-item-action-button"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </Button>
                  <span className="cart-item-quantity">
                    {item.ordered_quantity}
                  </span>
                  <Button
                    className="cart-item-action-button"
                    onClick={() => {
                      if (item.quantity === 1) {
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
        </div>
        {cartItems.length > 0 ? (
          <div className="cart-total-section">
            <h2 className="cart-total-title">Total: ${getCartTotal()}</h2>
            <Button
              className="cart-clear-button"
              style={{ float: "left" }}
              onClick={() => {
                clearCart();
                notifyCartCleared();
              }}
            >
              Clear Cart
            </Button>

            <Button
              className="btn btn-success"
              style={{ float: "right" }}
              onClick={handlePurchase}
            >
              Pay
            </Button>
          </div>
        ) : (
          <h3 className="cart-empty-message">Your cart is empty</h3>
        )}
      </Modal>
    )
  );
};

Cart.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

function generatePriceUpdateMessage(updatedPriceList) {
  if (updatedPriceList.result && updatedPriceList.items.length > 0) {
    let messages = updatedPriceList.items.map((item) => {
      return `The price of ${item.itemName} has changed. The previous price was ${item.previousPrice} and the current price is ${item.currentPrice}.`;
    });
    return messages.join("\n");
  } else {
    return "No price updates available.";
  }
}

async function purchase(loggedInUser, clearCart, notify, navigate) {
  console.log(navigate)
  let isClicked = false;
  try {
    const response = await fetch(USERITEMSERVICE + "/purchaseItems/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: loggedInUser.userId }),
    });
    if (response.ok) {
      Swal.fire({
        title: "Congratulations",
        text: "Purchase completed successfully!",
        icon: "success",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          isClicked = true;
          navigate("/shop", { replace: true });
        }
      });
      clearCart();
    } else {
      const data = await response.json();
      console.log(data.error);
      // notify(data.error, "error");
      Swal.fire({
        title: "Information",
        text: data.error,
        icon: "info",
        showCancelButton: true,
        showConfirmButton: false,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
  } catch (error) {
    console.error("Error during purchase:", error);
    notify("Purchase process failed.", "error");
  }
}

export default Cart;
