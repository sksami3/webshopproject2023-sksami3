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
import { useNavigate } from "react-router-dom";
import "../../src/Header.css"; 

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

      const loginResult = await AuthService.login(
        username.value,
        password.value
      );

      if (loginResult.success) {
        const loggedInUser = AuthService.getUserFromToken();
        if (loggedInUser) {
          setUser(loggedInUser);
        }

        toggleModal();
        window.location.reload();
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
    navigate('/', { replace: true });
    window.location.reload();
  };

  const toggle = () => {
    setshowModal(!showModal);
  };

  return (
    <div>
      <Navbar dark expand="md" className="navbar-custom">
        <div className="container">
          <NavbarToggler onClick={toggleNav} />
          <NavbarBrand className="mr-auto" href="/">
            Web Shop
          </NavbarBrand>
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link" to="/shop">
                  <span className="fa fa-home fa-lg"></span> Shop
                </NavLink>
              </NavItem>
              {user && (
                <NavItem>
                  <NavLink className="nav-link" to="/myitems">
                    <span className="fa fa-info fa-lg"></span> My Items
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <Nav className="ms-auto" navbar>
              {user ? (
                <>
                  <NavItem>
                    <span className="nav-link">Welcome, {user.username}</span>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link" to="/editUser">
                      <span className="fa fa-address-card fa-lg"></span> Edit
                      Account
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <Button
                      outline
                      onClick={handleLogout}
                      className="logout-button"
                    >
                      Logout
                    </Button>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem>
                    <NavLink className="nav-link" to="/signUp">
                      <span className="fa fa-list fa-lg"></span> Sign Up
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <Button
                      outline
                      onClick={toggleModal}
                      className="login-button"
                    >
                      <span className="fa fa-sign-in fa-lg"></span> Login
                    </Button>
                  </NavItem>
                </>
              )}
              <NavItem>
                {!showModal && (
                  <button
                    className="d-flex align-items-center cart-button"
                    onClick={toggle}
                  >
                    Cart ({cartItems.length})
                  </button>
                )}
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
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
