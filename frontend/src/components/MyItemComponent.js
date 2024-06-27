import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardImg,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { STATICSERVICE } from "../constants.js";
import "../../src/Shop.css";

function RenderMyItems({ item, onClk }) {
  const navigate = useNavigate();

  const handleButtonClick = (item) => {
    console.log("Button clicked for item:", item);
    navigate("/editItem/" + item.id);
  };

  return (
    <Card className="mb-4">
      <CardImg
        style={{
          height: "200px",
          width: "100%",
          objectFit: "fill",
        }}
        src={
          item.image
            ? STATICSERVICE + item.image
            : process.env.PUBLIC_URL + "/No_Image_Available.jpg"
        }
        alt={item.title}
      />
      <CardTitle>
        <strong>Title:</strong> {item.title}
      </CardTitle>
      <CardTitle>
        <strong>Price:</strong> {item.price}
      </CardTitle>
      <CardTitle>
        <strong>Quantity:</strong> {item.quantity}
      </CardTitle>
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
      <button onClick={() => handleButtonClick(item)}>Edit</button>
    </Card>
  );
}

const MyItems = (props) => {
  const myItems = props.items.map((item) => {
    return (
      <div className="col-10 col-md-3" key={item.id}>
        <RenderMyItems item={item} />
      </div>
    );
  });

  return (
    <div className="container mt-4 fullHeight">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Items</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>My Items</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <Link to="/AddItem" className="add-item-button">
            Add New Item
          </Link>
          <hr />
        </div>
        <div className="col-12">
          <h3>My Items</h3>
          <hr />
        </div>
      </div>
      <div className="row">
        {props.items.length > 0 ? (
          myItems
        ) : (
          <div className="col-12">
            <div className="col-12 col-md-4">
              <p>No items available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
