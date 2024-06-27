import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { STATICSERVICE } from "../constants";
import AuthService from "../services/AuthService";
import { ITEMSERVICE } from "../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EditItem = ({ item, onUpdate }) => {
  const imagePath = item.image
    ? STATICSERVICE + item.image
    : process.env.PUBLIC_URL + "/No_Image_Available.jpg";
  const [formData, setFormData] = useState(item);
  const [previewImage, setPreviewImage] = useState(imagePath);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(item);
    setPreviewImage(imagePath);
  }, [item, imagePath]);

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
        image: file, // Use the file object directly
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

    if (
      !formData.title ||
      !formData.price ||
      !formData.description ||
      !formData.quantity
    ) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Append all form data except the image
      if (value !== null && key !== "image") {
        formDataToSend.append(key, value);
      }
    });

    // Append image only if it's a file object (newly uploaded)
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    const response = await fetch(`${ITEMSERVICE}/${item.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      body: formDataToSend,
    });

    if (response.ok) {
      console.log("Item updated successfully");
      const updatedItem = await response.json();
      onUpdate(updatedItem);
      Swal.fire({
        title: "Success",
        text: "Item Updated!!!",
        icon: "success",
        showCancelButton: true,
        showConfirmButton: false,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/myitems", { replace: true });
        }
      });
    } else {
      console.error("Failed to update item:", response.statusText);
      alert("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            readonly
            disabled
            tabIndex={-1}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            readonly
            disabled
            tabIndex={-1}
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

        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="any"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity:</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            readonly
            disabled
            tabIndex={-1}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status:</label>
          <div>
            <span
              style={{
                color: formData.quantity === 0 ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {formData.quantity === 0 ? "Sold/Purchased" : "On Sale"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={formData.quantity === 0}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditItem;
