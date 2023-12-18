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

function RenderMyItems({ item, onClk }) {
  const handleButtonClick = (item) => {
    console.log("Button clicked for item:", item);
  };

  return (
    <Card>
      <CardImg width="100%" object src={item.image} alt={item.name} />
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
  console.log(props.items);
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
            <Link to="/myItems">MyItems</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>MyItems</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <h3>MyItems</h3>
          <hr />
        </div>
      </div>
      <div className="row">{myItems}</div>
    </div>
  );
};

export default MyItems;
