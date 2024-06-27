/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardImg,
  CardImgOverlay,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/cart.js";
import Cart from "./Cart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { STATICSERVICE } from "../constants.js";
import { USERSSERVICE } from "../constants.js";
import AuthService from "../services/AuthService.js";
import "../../src/Shop.css";
import Swal from "sweetalert2";

function RenderShop({ item, cartItems }) {
  const { addToCart, removeFromCart } = useContext(CartContext);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getUserFromToken();
    setLoggedInUser(user);
  }, []);

  const handleAddToCartClick = (item) => {
    if (!loggedInUser) {
      Swal.fire({
        title: "Info",
        text: "Please login first to add to cart",
        icon: "info",
        showCancelButton: true,
        showConfirmButton: false,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // navigate('/myitems', { replace: true });
        }
      });
      return;
    }
    addToCart(item);
    notifyAddedToCart(item);
  };

  const notifyAddedToCart = (item) =>
    toast.success(`${item.title} added to cart!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#fff",
        color: "#000",
      },
    });

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

  const handleRemoveFromCart = (product) => {
    removeFromCart(product);
    notifyRemovedFromCart(product);
  };

  return (
    <>
      <ToastContainer />
      <Card>
        <Link to={`/item/${item.id}`}>
          <CardImg
            style={{
              height: "200px",
              width: "100%",
              objectFit: "fill",
            }}
            object
            src={
              item.image
                ? STATICSERVICE + item.image
                : process.env.PUBLIC_URL + "/No_Image_Available.jpg"
            }
            alt={item.name}
          />

          <CardTitle>
            <strong />
            Title: {item.title}
          </CardTitle>
          <CardTitle>Price: {item.price}</CardTitle>
          <CardTitle>Quantity: {item.quantity}</CardTitle>
          <CardTitle>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: item.quantity === 0 ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {item.quantity === 0 ? "Sold/Purchased" : "On Sale"}
            </span>
          </CardTitle>
        </Link>
        {/* <button onClick={() => handleButtonClick(item)}>Add to Chart</button> */}
        {!cartItems.find((cartItem) => cartItem.id === item.id) ? (
          <button
            className={`d-flex align-items-center justify-content-center addToCartButton ${
              item.quantity === 0 ? "disabled-button" : ""
            }`}
            disabled={item.quantity === 0}
            onClick={() => {
              handleAddToCartClick(item);
            }}
          >
            Add to Cart
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>{" "}
          </button>
        ) : (
          <div className="d-flex align-items-center justify-content-between">
            <button
              className="d-flex align-items-center addToCartButton"
              onClick={() => {
                addToCart(item);
              }}
            >
              +
            </button>
            <p className="text-gray-600">
              {
                cartItems.find((cartItem) => cartItem.id === item.id)
                  .ordered_quantity
              }
            </p>
            <button
              className="d-flex align-items-center addToCartButton"
              onClick={() => {
                const cartItem = cartItems.find(
                  (cartItem) => cartItem.id === item.id
                );
                if (cartItem.ordered_quantity === 1) {
                  handleRemoveFromCart(item);
                } else {
                  removeFromCart(item);
                }
              }}
            >
              -
            </button>
          </div>
        )}
      </Card>
    </>
  );
}

const Shop = (props) => {
  // const shop = (props) => {
  const [showModal, setshowModal] = useState(false);
  const [filterTerm, setFilterTerm] = useState("");
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [fileExists, setFileExists] = useState(false);
  const [credFilePath, setCredFilePath] = useState("");

  useEffect(() => {
    // Check if the file exists when the component mounts
    const checkFileExists = async () => {
      try {
        setCredFilePath(`${USERSSERVICE}/get_credential_file`);
        fetch(`${USERSSERVICE}/check_if_credential_file_exists`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data.isFileExists) {
              setFileExists(true);
            } else {
              setFileExists(false);
            }
          })
          .catch((error) => {
            console.error("Error fetching the credential file:", error);
            setFileExists(false);
          });
      } catch (error) {
        console.error("Fetch error:", error);
        setFileExists(false);
      }
    };

    checkFileExists();
  }, []);

  const handlePopulateDB = async () => {
    try {
      const response = await fetch(USERSSERVICE + "/auto_migration", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Database populated successfully:", data);
        Swal.fire({
          title: "Info",
          text: "Database populated successfully!! After clicking close button, you will find the download link for the user credentials and item information. And make sure to log out if you are logged in.",
          icon: "info",
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.reload();
          }
        });
      } else {
        console.error("Error populating database:", response.statusText);
        toast.error("Failed to populate database.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error populating database:", error);
      alert("An error occurred while populating the database.");
    }
  };

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value.toLowerCase());
  };

  const filteredItems = props.items.filter((item) =>
    item.title.toLowerCase().includes(filterTerm)
  );

  const shop = () => {
    return (
      <>
        {filteredItems.map((item) => {
          return (
            <div className="col-4 col-md-3 m-0" key={item.id}>
              <RenderShop item={item} key={item.id} cartItems={cartItems} />
              <br />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="container fullHeight">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/shop">Shop</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Shop</BreadcrumbItem>
        </Breadcrumb>
        <div className="row">
          <div className="col-7">
            <h3>Shop</h3>
          </div>
          <div className="col-5">
            <div className="row">
              <div className="col-4">
                <button onClick={handlePopulateDB} className="btn btn-primary">
                  Populate DB
                </button>
              </div>
              {fileExists && (
                <div className="col-8">
                  <a
                    href={credFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="blinking-link"
                  >
                    View user creds and item info
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row col-md-4" style={{ padding: "inherit" }}>
        <input
          type="text"
          placeholder="Filter by title..."
          value={filterTerm}
          onChange={handleFilterChange}
        />
      </div>
      <br />
      <div className="row">{shop()}</div>
    </div>
  );
};

export default Shop;
