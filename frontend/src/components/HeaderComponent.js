import React, { useState, useContext, useEffect } from "react";
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
import AuthService from "../services/AuthService.js";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = AuthService.getUserFromToken();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { username, password } = event.target;

      const loginResult = await AuthService.login(username.value, password.value);

      if (loginResult.success) {
        const loggedInUser = AuthService.getUserFromToken();
        if (loggedInUser) {
          setUser(loggedInUser);
        }

        toggleModal();
      } else {
        console.error("Login Error:", loginResult.error);
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("An unexpected error occurred during login.");
    }
  };

  const handleLogout = () => {
    AuthService.removeToken();
    setUser(null);
  };

  const toggle = () => {
    setshowModal(!showModal);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar dark expand="md">
        <div className="container">
          <NavbarToggler onClick={toggleNav} />
          <NavbarBrand className="mr-auto" href="/">
            {/* Your logo or brand */}
          </NavbarBrand>
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              {/* Shop Menu */}
              <NavItem>
                <NavLink className="nav-link" to="/shop">
                  <span className="fa fa-home fa-lg"></span> Shop
                </NavLink>
              </NavItem>
              {/* My Items Menu */}
              <NavItem>
                <NavLink className="nav-link" to="/myitems">
                  <span className="fa fa-info fa-lg"></span> My Items
                </NavLink>
              </NavItem>
              {/* Add more NavItem components for other navigation links */}
            </Nav>
            <Nav className="ms-auto" navbar>
              {user ? (
                <>
                  {/* User Greeting */}
                  <NavItem>
                    <span className="nav-link">Welcome, {user.username}</span>
                  </NavItem>
                  {/* Edit Account Menu (Visible when logged in) */}
                  <NavItem>
                    <NavLink className="nav-link" to="/editUser">
                      <span className="fa fa-address-card fa-lg"></span> Edit Account
                    </NavLink>
                  </NavItem>
                  {/* Logout Button */}
                  <NavItem>
                    <Button outline onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavItem>
                </>
              ) : (
                <>
                  {/* Sign Up Menu */}
                  <NavItem>
                    <NavLink className="nav-link" to="/signUp">
                      <span className="fa fa-list fa-lg"></span> Sign Up
                    </NavLink>
                  </NavItem>
                  {/* Login Button */}
                  <NavItem>
                    <Button outline onClick={toggleModal}>
                      <span className="fa fa-sign-in fa-lg"></span> Login
                    </Button>
                  </NavItem>
                </>
              )}
              {/* Cart Button */}
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

      {/* Jumbotron */}
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

      {/* Login Modal */}
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

      {/* Cart Component */}
      <Cart showModal={showModal} toggle={toggle} />
    </div>
  );
};

export default Header;
