import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const adminUser = localStorage.getItem("adminUser");

  const [currentPage, setCurrentPage] = useState(1);
      
  const reviewsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }
    fetch("https://hafiz899.pythonanywhere.com/api/all-reviews/")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      fetch(`https://hafiz899.pythonanywhere.com/api/delete-reviews/${id}/`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message);
          setReviews(reviews.filter((rev) => rev.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  // Pagination Logic      1 * 5
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage; // 5-5

  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePagination = (page) => setCurrentPage(page);

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} />
      <div>
        <h3 className="text-center text-dark mb-4">
          <i className="fas fa-star text-warning me-1"></i>
          Manage Reviews
        </h3>
        <h5 className="text-end text-muted">
          <i className="fas fa-database me-1"></i>
          Total Reviews
          <span className="ms-2 badge bg-warning">{reviews.length}</span>
        </h5>

        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Food Item</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((r, index) => (
              <tr key={r.id}>
                <td>{indexOfFirstReview + index + 1}</td>
                <td>{r.food_name}</td>
                <td>{r.user_name}</td>
                <td>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`text-warning fa-star ${i < r.rating ? "fas" : "far"}`}
                    ></i>
                  ))}
                </td>
                <td>{r.comment}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fas fa-trash-alt me-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${page === currentPage ? "active" : ""}`}
                  >
                    <button
                      onClick={() => handlePagination(page)}
                      className="page-link"
                    >
                      {page}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageReviews;
