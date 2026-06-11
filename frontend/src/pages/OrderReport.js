import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const OrderReport = () => {
    const [formData, setFormData] = useState ({
        from_date: '',
        to_date: '',
        status: 'all',
    })
    const [orders, setOrders] = useState([]);
      const adminUser = localStorage.getItem('adminUser');
    
      const navigate = useNavigate();
    
      useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }
      }, []);

      const handleChange = (e) => {
    
        setFormData ({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

      const handleSubmit = async (e) => {
          e.preventDefault();
      
          try {
            const response = await fetch("https://hafiz899.pythonanywhere.com/api/order-between-dates/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify( formData)
            });
      
            const data = await response.json();
      
            if (response.status === 200) {
                 setOrders(data);
            } else {
              toast.error("Something went wrong");
            }
          } catch (error) {
            console.error(error);
            toast.error("Error connecting to server");
          }
        };
      
    
  return (
    <AdminLayout>
         <ToastContainer position='top-right' autoClose={2000}/>
      <div>
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-file me-1"></i>
            Between Date Reports
        </h3>
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row mb-3">
               <div className="col-md-4">
                  <label>From Date:</label>
                  <input type="date" name="from_date" onChange={handleChange} className="form-control" required/>
               </div>
               <div className="col-md-4">
                  <label>To Date:</label>
                  <input type="date" name="to_date" onChange={handleChange} className="form-control" required/>
               </div>
               <div className="col-md-4">
                  <label>Status:</label>
                  <select name="status" onChange={handleChange} className="form-control">
                    <option value="all">All</option>
                    <option value="not_confirmed">Not Confirmed</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Food being Prepared">Food Being Prepared</option>
                    <option value="Food Pickup">Food Pickup</option>
                    <option value="Food Delivered">Food Delivered</option>
                    <option value="Order Cancelled">Order Cancelled</option>
                  </select> 
               </div>
            </div>
            <div className="text-center">
                <button className="btn btn-primary" type="submit">Submit</button> 
            </div>
        </form>

        {orders.length > 0 && (
            <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Order Number</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.order_number}</td>
                <td>{new Date(order.order_time).toLocaleString()}</td>
                <td>
                  <a href={`/admin-view-order-detail/${order.order_number}`}  className="btn btn-sm btn-info me-2">
                    <i className="me-1"></i>View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </AdminLayout>
  )
}

export default OrderReport
