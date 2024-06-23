import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { STATICSERVICE } from "../constants.js";
import {
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { CartContext } from "../context/cart.js";
import Cart from "./Cart.js";

function RenderItem({ item }) {
  if (item == null || item === undefined) {
    return <div></div>;
  } else {
    return (
      <>
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/shop">Shop</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{item.title}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12 col-md-5 m-1">
            <Card>
              <CardImg
                style={{
                  height: "200px",
                  width: "100%",
                  objectFit: "fill",
                }}
                object
                src={
                  item.image ? STATICSERVICE + item.image : process.env.PUBLIC_URL + "/No_Image_Available.jpg"
                }
                alt={item.name}
              />
              <CardBody>
                <CardTitle>
                  <div className="form-group">
                    <p className="card-title">
                      <b>Title:</b> {item.title} 
                    </p>
                  </div>
                </CardTitle>
                <CardText><b>Description:</b> {item.description}</CardText>
              </CardBody>
            </Card>
          </div>

          <div className="col-12 col-md-5 m-1">
            <div className="card">
              <div className="card-body">
                <p className="card-title">
                  <b>Price:</b> {item.price} €{" "}
                </p>

                <div className="form-group">
                  <p className="card-title">
                    <b>Available Quantity:</b> {item.quantity} 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row"></div>
      </>
    );
  }
}

const ItemDetail = (props) => {
  if (props.item) {
    return (
      <div className="container">
        <div className="row">
          <RenderItem item={props.item} key={props.item.id} />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ItemDetail;
