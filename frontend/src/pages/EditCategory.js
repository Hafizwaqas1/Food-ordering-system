import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const EditCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const { id } = useParams();
  const adminUser = localStorage.getItem("adminUser");

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }
    fetch(`https://hafiz899.pythonanywhere.com/api/category-details/${id}/`)
      .then(res => res.json())
      .then(data => setCategoryName(data.category_name))
      .catch(err => console.error(err));  
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`https://hafiz899.pythonanywhere.com/api/category-details/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name: categoryName }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message);
        setTimeout(() => {
            navigate('/manage-category');
        }, 2000);
      })
      .catch(err => console.error(err));
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4">
              <i className="fas fa-pen-square text-success me-2"></i>Edit
              Category
            </h4>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-lable">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <button type="submit" className="btn btn-success mt-2">
                <i className="fas fa-save me-2"></i>Edit Category
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-utensils"
            style={{ fontSize: "180px", color: "#e5e5e5" }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCategory;
