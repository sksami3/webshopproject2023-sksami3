import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddItem = () => {
  const initialFormData = {
    title: "",
    image: "",
    price: 0,
    quantity: 1,
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file.name, // You can use a better approach for handling images, such as uploading to a server and storing the URL.
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
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

    // Perform your submission logic here
    console.log("Form Data Submitted:", formData);

    // Reset the form after submission if needed
    setFormData(initialFormData);
    setPreviewImage(null);
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

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;
