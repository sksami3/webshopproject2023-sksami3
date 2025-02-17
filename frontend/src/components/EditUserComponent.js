import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { USERSSERVICE } from "../constants";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = ({ user }) => {
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    email: "",
  });
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data based on the user ID when component mounts
    if (user) {
      setFormData({ ...formData, ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset password mismatch error state on any input change
    setPasswordMismatchError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the new password and confirm new password match
    if (formData.newPassword !== formData.confirmNewPassword) {
      setPasswordMismatchError(true);
      return;
    }
    let isFire = false;
    try {
      const response = await fetch(`${USERSSERVICE}/change_password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          userId: AuthService.getUserFromToken().userId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        isFire = true;
        Swal.fire({
          title: "Oops!!!",
          text: data.error,
          icon: "error",
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
        throw new Error(data.error || "Failed to change password.");
      } else {
        toast.success("Password successfully changed", data.message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            backgroundColor: "#fff",
            color: "#000",
          },
        });
        setTimeout(function () {
          navigate("/shop", { replace: true });
        }, 5000);
      }
    } catch (error) {
      console.error("Error changing password:" + error.message);
      if (!isFire)
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      // Handle error - for example, display an error message to the user
    }

    // Assume success and redirect to another page after editing
    //navigator('/');
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Old Password:</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password:</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Retype New Password:</label>
            <input
              type="password"
              className="form-control"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />
            {passwordMismatchError && (
              <div style={{ color: "red" }}>The new passwords must match.</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </>
  );
};

export default EditUser;
