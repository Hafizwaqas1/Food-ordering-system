import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New Password and Confirm Password do not match");
        return;
      }
      const response = await fetch(
        `https://hafiz899.pythonanywhere.com/api/change_password/${userId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
          }),
        },
      );

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || "Password changed successfully");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h3 className="text-center text-danger mb-4">
          <i className="fas fa-key me-1"></i>
           Change Password
        </h3>

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
            <div className="mb-3">
              <label className="mb-1">Current Password</label>
              <input
                type="password"
                className="form-control"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password "
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">New Password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type new password"
              />
            </div>
          
          <button type="submit" className="btn btn-primary mt-3">
            <i className="fas fa-check-circle me-2"></i>
             Change Password
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default ChangePassword;
