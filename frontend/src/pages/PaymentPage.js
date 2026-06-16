import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const userId = localStorage.getItem("userId");
  const [paymentMode, setPaymentMode] = useState("");
  const [address, setAddress] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const navigate = useNavigate();

  // const handlePlaceOrder = async () => {
  //     if (paymentMode === 'online') {
  //         const { cardNumber, expiry, cvv } = cardDetails;

  //         if (!cardNumber || !expiry || !cvv) {
  //             toast.error('Please fill in all card details');
  //             return;
  //         }
  //     }

  //          try {
  //                     const response = await fetch("https://hafiz899.pythonanywhere.com/api/place_order/", {
  //                       method: "POST",
  //                       headers: { "Content-Type": "application/json" },
  //                       body: JSON.stringify({
  //                         userId: userId,
  //                         address: address,
  //                         paymentMode: paymentMode,
  //                         cardNumber: paymentMode === 'online' ? cardDetails.cardNumber: '',
  //                         expiry: paymentMode === 'online' ? cardDetails.expiry: '',
  //                         cvv: paymentMode === 'online' ? cardDetails.cvv: '',
  //                       }),
  //                     });

  //                     const result = await response.json();

  //                     if (response.status === 201) {
  //                       toast.success(result.message);
  //                       setTimeout(() => {
  //                         navigate('/my-orders');
  //                       },2000);

  //                     } else {
  //                       toast.error(result.message || 'Something went wrong');
  //                     }
  //                   } catch (error) {
  //                     console.error(error);
  //                     toast.error("Error connecting to server");
  //                   }

  // }

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please enter delivery address");
      return;
    }

    if (!paymentMode) {
      toast.error("Please select payment method");
      return;
    }

    // CASH ON DELIVERY FLOW

    if (paymentMode === "cod") {
      try {
        const response = await fetch(
          "https://hafiz899.pythonanywhere.com/api/place_order/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              address: address,
              paymentMode: paymentMode,
              cardNumber: "",
              expiry: "",
              cvv: "",
            }),
          },
        );

        const result = await response.json();

        if (response.status === 201) {
          toast.success(result.message);

          setTimeout(() => {
            navigate("/my-orders");
          }, 2000);
        } else {
          toast.error(result.message || "Order failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error placing COD order");
      }

      return;
    }

    // ONLINE PAYMENT FLOW (STRIPE)
    if (paymentMode === "online") {
      try {
        const res = await fetch(
          "https://hafiz899.pythonanywhere.com/api/create-session/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
            }),
          },
        );

        const data = await res.json();

        if (data.url) {
          // Redirect user to Stripe checkout page
          window.location.href = data.url;
        } else {
          toast.error("Payment session not created");
        }
      } catch (error) {
        console.log(error);
        toast.error("Stripe payment failed");
      }
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-credit-card me-2"></i>
          Checkout & Payment
        </h3>
        <div className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label fw-semibold">Delivery Address</label>
            <textarea
              className="form-control border-primary-subtle"
              rows="3"
              required
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              required
              value="cod"
              checked={paymentMode === "cod"}
              onChange={() => setPaymentMode("cod")}
            />
            <label className="form-check-label">Cash on Delivery</label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="online"
              required
              checked={paymentMode === "online"}
              onChange={() => setPaymentMode("online")}
            />
            <label className="form-check-label">Online Payment</label>
          </div>

          {/* {paymentMode === 'online' && (
                <div className='row'>
                   <div className='col-md-6'>
                      <label className='form-label'>Card Number</label>
                      <input className='form-control'
                      type="text" placeholder='1234 **** **** ****' value={cardDetails.cardNumber}
                      onChange={(e)=> setCardDetails({...cardDetails,cardNumber:e.target.value})}
                      />
                   </div>
                   <div className='col-md-3'>
                      <label className='form-label'>Expiry</label>
                      <input className='form-control'
                      type="text" placeholder='MM/YY' value={cardDetails.expiry}
                      onChange={(e)=> setCardDetails({...cardDetails, expiry:e.target.value})}
                      />
                   </div>
                   <div className='col-md-3'>
                      <label className='form-label'>CVV</label>
                      <input className='form-control'
                      type="password" value={cardDetails.cvv}
                      onChange={(e)=> setCardDetails({...cardDetails,cvv:e.target.value})}
                      />
                   </div>
                </div>
            )} */}
          {paymentMode === "online" && (
            <div className="alert alert-info mt-3">
              <i className="fas fa-lock me-2"></i>
              You will be redirected to a secure Stripe payment page after
              clicking “Place Order”.
            </div>
          )}
          <button
            className="btn btn-success mt-4 w-100"
            onClick={handlePlaceOrder}
          >
            <i className="fas fa-check-circle me-2"></i>
            Place Order
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PaymentPage;
