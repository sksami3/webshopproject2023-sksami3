import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";

function RenderItem({ item }) {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddToCart = (item, quantity) => {
    // Handle the logic for adding the product to the cart
    console.log(item);
    console.log(quantity);
  };

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
              <CardImg width="100%" src={item.image} alt={item.title} />
              <CardBody>
                <CardTitle>
                  <b>{item.title}</b>
                </CardTitle>
                <CardText>{item.description}</CardText>
              </CardBody>
            </Card>
          </div>

          <div className="col-12 col-md-5 m-1">
            <div className="card">
              <div className="card-body">
                <p className="card-title">
                  <b>Price: {item.price} €</b>{" "}
                </p>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    placeholder="Enter quantity"
                    onChange={handleQuantityChange}
                    value={quantity}
                    min="1"
                    max={item.quantity}
                    defaultValue="1"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => handleAddToCart(item, quantity)}
                >
                  Add to Cart
                </button>
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
