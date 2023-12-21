// EditItem.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditItem = ({ item, onEdit }) => {
  const [formData, setFormData] = useState(item);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setFormData(item);
  }, [item]);

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
        image: file.name,
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
    if (!formData.title || !formData.description) {
      alert('Title and description are mandatory fields. Please fill them in.');
      return;
    }

    // Validate price is a number
    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Please enter a valid price greater than 0.');
      return;
    }

    // Validate quantity is a number and minimum 1
    const parsedQuantity = parseInt(formData.quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      alert('Please enter a valid quantity (minimum 1).');
      return;
    }

    // Perform your edit logic here
    onEdit(formData);

    // Optionally, you can reset the form or perform other actions after editing
    setPreviewImage(null);
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
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="img-thumbnail mt-2" style={{ maxWidth: '200px' }} />
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="text"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
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
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditItem;
