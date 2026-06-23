import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const order_number = searchParams.get("order_number");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await fetch("https://hafiz899.pythonanywhere.com/api/stripe-success-confirm/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_number: order_number,
            userId: userId,
          }),
        });
      } catch (error) {
        console.log("Payment confirm error:", error);
      }

      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);
    };

    if (order_number && userId) {
      confirmPayment();
    }
  }, [order_number, userId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 style={{ color: "green" }}>🎉 Payment Successful!</h2>
      <p>Confirming your order...</p>
    </div>
  );
};

export default PaymentSuccess;