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

function RenderShop({ item, onClk }) {
  const handleButtonClick = (item) => {
    console.log("Button clicked for item:", item);
  };

  return (
    <Card>
      <Link to={`/item/${item.id}`}>
        <CardImg width="100%" object src={item.image} alt={item.name} />
        <CardTitle>
          <strong />
          Title: {item.title}
        </CardTitle>
        <CardTitle>Price: {item.price}</CardTitle>
        <CardTitle>Quantity: {item.quantity}</CardTitle>
      </Link>
      <button onClick={() => handleButtonClick(item)}>Add to Chart</button>
    </Card>
  );
}
const Shop = (props) => {
  const shop = props.items.map((item) => {
    return (
      <div className="col-4 col-md-3 m-0">
        <RenderShop item={item} key={item.id} />
        <br />
      </div>
    );
  });

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
      <div className="row">{shop}</div>
    </div>
  );
};

export default Shop;
