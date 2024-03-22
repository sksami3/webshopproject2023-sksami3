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
import { useNavigate } from 'react-router-dom';
import { STATICSERVICE } from "../constants.js";

function RenderMyItems({ item, onClk }) {
  const navigation = useNavigate();

  const handleButtonClick = (item) => {
    console.log("Button clicked for item:", item);
    navigation('/editItem/' + item.id);
  };

  return (
    <Card>
      <CardImg
            style={{
              height: "200px", 
              width: "100%", 
              objectFit: "fill", 
            }}
            object
            src={STATICSERVICE + item.image}
            alt={item.name}
          />
      <CardTitle>
        <strong />
        Title: {item.title}
      </CardTitle>
      <CardTitle>Price: {item.price}</CardTitle>
      <CardTitle>Quantity: {item.quantity}</CardTitle>
      <button onClick={() => handleButtonClick(item)}>Edit</button>
    </Card>
  );
}
const MyItems = (props) => {
  const myItems = props.items.map((item) => {
    return (
      <div className="col-4 col-md-3 m-0">
        <RenderMyItems item={item} key={item.id} />
        <br />
      </div>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Items</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>My Items</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <Link to="/AddItem">Add New Item</Link>
          <hr />
        </div>
        <div className="col-12">
          <h3>My Items</h3>
          <hr />
        </div>
      </div>
      <div className="row">{myItems}</div>
    </div>
  );
};

export default MyItems;
