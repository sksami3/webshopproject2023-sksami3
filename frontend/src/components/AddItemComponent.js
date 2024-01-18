import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "../services/AuthService";
import { ITEMSERVICE } from "../constants";

const AddItem = () => {
  const initialFormData = {
    title: "",
    image: null,
    price: 0,
    quantity: 1,
    description: "",
    created_by: AuthService.getUserFromToken()?.userId || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? e.target.files[0] : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mandatory fields
    if (
      !formData.title ||
      !formData.price ||
      !formData.description ||
      !formData.quantity
    ) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    try {
      // Send the form data to the API using FormData
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch(ITEMSERVICE + "/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Item added successfully");
        // Reset the form after successful submission if needed
        setFormData(initialFormData);
        setPreviewImage(null);
      } else {
        console.error("Failed to add item:", response.statusText);
        alert("Failed to add item. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 col-md-5">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 col-md-5">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="img-thumbnail mt-2"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>

        <div className="mb-3 col-md-5">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        <div className="mb-3 col-md-5">
          <label className="form-label">Quantity:</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <div className="mb-3 col-md-7">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="hidden"
          name="created_by"
          value={formData.created_by}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;
