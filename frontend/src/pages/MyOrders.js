import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaInfoCircle, FaMapMarkedAlt } from "react-icons/fa";

const MyOrders = () => {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://hafiz899.pythonanywhere.com/api/orders/${userId}/`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [userId, navigate]);

 const getStatusBadge = (status = "") => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("delivered")) return "success";
    if (statusLower.includes("cancelled")) return "danger";
    if (statusLower.includes("confirmed")) return "info";
    if (statusLower.includes("prepared")) return "warning";
    if (statusLower.includes("cod")) return "primary";
    if (statusLower.includes("pending")) return "warning";

    return "secondary";
};

  return (
    <PublicLayout>
      <div className="container py-5">

        <h3 className="text-center mb-4">
          <FaBoxOpen className="text-warning me-2" size={50}/>
          My Orders
        </h3>

        {orders.length === 0 ? (
          <p className="text-center">No Orders Found.</p>
        ) : (

          orders.map((order) => (

            <div className="card mb-4 shadow-sm" key={order.order_number}>

              <div className="card-body">

                <h5>Order #{order.order_number}</h5>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <p>
                  <strong>Payment:</strong> {order.payment_status}
                </p>

                <span className={`badge bg-${getStatusBadge(order.payment_status)}`}>
                  {order.payment_status}
                </span>

                <hr />

                {order.items?.map((item) => (

                  <div
                    key={item.id}
                    className="d-flex align-items-center mb-3"
                  >

                    <img
                      src={`https://hafiz899.pythonanywhere.com${item.food.image}`}
                      width="80"
                      alt={item.food.item_name}
                      className="me-3"
                    />

                    <div className="flex-grow-1">

                      <h6>{item.food.item_name}</h6>

                      <div>Quantity : {item.quantity}</div>

                      <div>Rs. {item.food.item_price}</div>

                    </div>

                  </div>

                ))}

                <Link
                  to={`/track-order/${order.order_number}`}
                  className="btn btn-outline-secondary me-2"
                >
                  <FaMapMarkedAlt /> Track
                </Link>

                <Link
                  to={`/order-details/${order.order_number}`}
                  className="btn btn-outline-primary"
                >
                  <FaInfoCircle /> Details
                </Link>

              </div>

            </div>

          ))

        )}

      </div>
    </PublicLayout>
  );
};

export default MyOrders;