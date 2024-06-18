import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { USERSSERVICE } from "../constants";
import "../../src/SignUp.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [errors, setErrors] = useState({ username: "", email: "" });
  const navigator = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = USERSSERVICE + "/register";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setErrors({ username: "", email: "" });
        console.log("Server response:", responseData);
        Swal.fire({
          title: "Congratulations",
          text: "Account created successfully!",
          icon: "success",
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            navigator("/shop", { replace: true });
          }
        });
      } else {
        const data = await response.json();
        setErrors({
          username: data.username ? data.username[0] : "",
          email: data.email ? data.email[0] : "",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="signup-container">
        <div className="container mt-5 signup-form">
          <div className="form-container">
            <h2 className="signup-title">
              {userId ? "Edit Account" : "Sign Up"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 col-md-5">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && (
                  <p style={{ color: "red" }}>{errors.username}</p>
                )}
              </div>

              <div className="mb-3 col-md-5">
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 col-md-5">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
              </div>

              <button type="submit" className="btn btn-primary">
                {userId ? "Save Changes" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
