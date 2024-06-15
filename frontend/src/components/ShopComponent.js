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

function RenderShop({ item, cartItems }) {
  const { addToCart, removeFromCart } = useContext(CartContext);

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
            src={item.image ? STATICSERVICE + item.image : process.env.PUBLIC_URL + "/No_Image_Available.jpg"}
            alt={item.name}
          />

          <CardTitle>
            <strong />
            Title: {item.title}
          </CardTitle>
          <CardTitle>Price: {item.price}</CardTitle>
          <CardTitle>Quantity: {item.quantity}</CardTitle>
        </Link>
        {/* <button onClick={() => handleButtonClick(item)}>Add to Chart</button> */}
        {!cartItems.find((cartItem) => cartItem.id === item.id) ? (
          <button
            className="d-flex align-items-center justify-content-center addToCartButton"
            onClick={() => {
              addToCart(item);
              notifyAddedToCart(item);
            }}
          >
            Add to cart
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
              {cartItems.find((cartItem) => cartItem.id === item.id).quantity}
            </p>
            <button
              className="d-flex align-items-center addToCartButton"
              onClick={() => {
                const cartItem = cartItems.find(
                  (cartItem) => cartItem.id === item.id
                );
                if (cartItem.quantity === 1) {
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
  const [filterTerm, setFilterTerm] = useState('');
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const toggle = () => {
    setshowModal(!showModal);
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
    <div className="container">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/shop">Shop</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Shop</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <h3>Shop</h3>
          <hr />
        </div>
      </div>
      <div className="row col-md-4" style={{ padding: 'inherit' }}>
        <input
          type="text"
          placeholder="Filter by title..."
          value={filterTerm}
          onChange={handleFilterChange}
        />
      </div>
      <br />
      <div className="row">
        {shop()}
      </div>
    </div>
  );
};

export default Shop;
