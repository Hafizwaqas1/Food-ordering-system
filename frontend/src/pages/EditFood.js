import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

const EditFood = () => {
  const [categoryName, setCategoryName] = useState("");
  const { id } = useParams();
  const adminUser = localStorage.getItem("adminUser");

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    item_price: "",
    item_description: "",
    image: "",
    item_quantity: "",
    is_available: ""
  });

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }
    fetch(`https://hafiz899.pythonanywhere.com/api/edit-food/${id}/`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error(err));

    fetch("https://hafiz899.pythonanywhere.com/api/manage-category/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(); // combine text and image to send

    data.append("category", formData.category);
    data.append("item_name", formData.item_name);
    data.append("item_description", formData.item_description);
    data.append("item_quantity", formData.item_quantity);
    data.append("item_price", formData.item_price);
    data.append("image", formData.image);
    data.append("is_available", formData.is_available ? "true" : "false");

    try {
      const response = await fetch(
        `https://hafiz899.pythonanywhere.com/api/edit-food/${id}/`,
        {
          method: "PUT",
          body: data,
        },
      );

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message);
        setTimeout(() => {
                navigate('/manage-food')
            }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4">
              <i className="fas fa-pen-square text-success me-2"></i>Edit Food
              Item
            </h4>
            <form onSubmit={handleSubmit} encType="multipart/formdata">
              <div className="mb-3">
                <label className="form-lable">Food Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-lable">Edit Food Item</label>
                <input
                  name="item_name"
                  type="text"
                  className="form-control"
                  value={formData.item_name}
                  onChange={handleChange}
                  placeholder="Enter food name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-lable">Description</label>
                <textarea
                  name="item_description"
                  className="form-control"
                  value={formData.item_description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-lable">Quantity</label>
                <input
                  name="item_quantity"
                  type="text"
                  className="form-control"
                  value={formData.item_quantity}
                  onChange={handleChange}
                  placeholder="e.g. 2 pcs / Large"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-lable">Price(Rs)</label>
                <input
                  name="item_price"
                  type="number"
                  step=".01"
                  className="form-control"
                  value={formData.item_price}
                  onChange={handleChange}
                  placeholder="Enter item price"
                  required
                />
              </div>
              <div className="mb-3 form-check form-switch">
                <input
                  name="is_available"
                  type="checkbox"
                  className="form-check-input"
                  checked={formData.is_available}
                  onChange={(e) =>
                    setFormData({ ...formData,is_available: e.target.checked })}
                />
                <label className="form-check-label">
                  {formData.is_available ? "Available" : "Not Available"}
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="col-md-6">
                    {formData.image && (
                      <img src={getImageUrl(formData.image)}
                      className="img-fluid"
                      style={{maxHeight:'100px', padding:'4px', border:'1px solid red',
                        borderRadius:'8px'
                      }} />
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-success mt-2">
                <i className="fas fa-plus me-2"></i>Edit Food Item
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-pizza-slice"
            style={{ fontSize: "180px", color: "#e5e5e5" }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditFood;
