import React, { useState } from "react";
import PublicLayout from "./PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobilenumber: "",
    password: "",
    repeatpassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstname,
      lastname,
      email,
      mobilenumber,
      password,
      repeatpassword,
    } = formData;

    if (password !== repeatpassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    try {
      const response = await fetch("https://hafiz899.pythonanywhere.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          mobilenumber,
          password,
        }),
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success(result.message || "You have registered successfully");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          mobilenumber: "",
          password: "",
          repeatpassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row shadow-lg rounded-4">
          <div className="col-md-6 p-4">
            <h3 className="text-center mb-4">
              <i className="fas fa-user-plus me-2"></i>
              User Registration
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  name="firstname"
                  type="text"
                  className="form-control"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="lastname"
                  type="text"
                  className="form-control"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="mobilenumber"
                  type="numeric"
                  className="form-control"
                  value={formData.mobilenumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="repeatpassword"
                  type="password"
                  className="form-control"
                  value={formData.repeatpassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <button className="btn btn-primary w-100">
                <i className="fas fa-user-check me-2"></i>
                Submit
              </button>
              <div className="text-center mt-3">
                <span className="text-muted">Already have an account?</span>{" "}
                <Link
                  to="/login"
                  className="text-primary text-decoration-none fw-bold"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="p-4 text-center">
              <img
                src="/images/register-png.png"
                alt="Register illustration"
                className="img-fluid"
                style={{ maxHeight: "400px" }}
              />
              <h5 className="mt-3 text-primary">
                Registration is fast, secure and free.
              </h5>
              <p className="text-muted-secondary small">
                Join our food family and enjoy delicious food to your door step!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;
