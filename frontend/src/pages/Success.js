import { useEffect } from "react";

const Success = () => {

  useEffect(() => {

    const confirmPayment = async () => {

      const sessionId = new URLSearchParams(window.location.search).get("session_id");

      if (!sessionId) return;

      try {
        const response = await fetch(
          "https://hafiz899.pythonanywhere.com/api/payments/confirm/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: sessionId,
            }),
          }
        );

        const data = await response.json();

        console.log("Payment Confirm Response:", data);

      } catch (error) {
        console.error("Payment confirmation failed:", error);
      }
    };

    confirmPayment();

  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Successful</h1>
      <p>Your order has been confirmed successfully.</p>
    </div>
  );
};

export default Success;