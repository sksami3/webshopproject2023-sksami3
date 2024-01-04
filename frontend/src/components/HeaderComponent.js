import React, { useState, useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { CartContext } from "../context/cart.js";
import Cart from "./Cart.js";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModal, setshowModal] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleLogin = (event) => {
    toggleModal();
    alert(
      "Username: " +
        event.target.username.value +
        " Password: " +
        event.target.password.value +
        " Remember: " +
        event.target.remember.checked
    );
    event.preventDefault();
  };

  const toggle = () => {
    setshowModal(!showModal);
  };

  return (
    <div>
      <Navbar dark expand="md">
        <div className="container">
          <NavbarToggler onClick={toggleNav} />
          <NavbarBrand className="mr-auto" href="/">
            {/* <img
                src="assets/images/logo.png"
                height="30"
                width="41"
                alt="Ristorante Con Fusion"
              /> */}
          </NavbarBrand>
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link" to="/shop">
                  <span className="fa fa-home fa-lg"></span> Shop
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/myitems">
                  <span className="fa fa-info fa-lg"></span> My Items
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="ms-auto" navbar>
              <NavItem>
                <NavLink className="nav-link" to="/signUp">
                  <span className="fa fa-list fa-lg"></span> Sign Up
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/editAccount">
                  <span className="fa fa-address-card fa-lg"></span> Edit Account
                </NavLink>
              </NavItem>
              <NavItem>
                <Button outline onClick={toggleModal}>
                  <span className="fa fa-sign-in fa-lg"></span> Login
                </Button>
              </NavItem>
              <NavItem>
                {!showModal && (
                  <button className="d-flex align-items-center" onClick={toggle}>
                    Cart ({cartItems.length})
                  </button>
                )}
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
      <div className="jumbotron">
        <div className="container">
          <div className="row row-header">
            <div className="col-12 col-sm-6">
              <h1>Web Shop</h1>
              <p>Best online shopping site for Åbo Akademi University students</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Login</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input type="text" id="username" name="username" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" name="password" />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" name="remember" />
                Remember me
              </Label>
            </FormGroup>
            <Button type="submit" value="submit" color="primary">
              Login
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      <Cart showModal={showModal} toggle={toggle} />
    </div>
  );
};

export default Header;
