import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/track.css";
import { useParams } from "react-router-dom";


const TrackOrders = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [trackingData, setTrackingData] = useState([]);

    const { paramOrderNumber } = useParams();

    useEffect(() => {
        if (paramOrderNumber)
        {
        setOrderNumber(paramOrderNumber);
        handleTrack(paramOrderNumber);
        }  
      }, [paramOrderNumber]);

      const handleTrack = async (orderNum) => {

        try {
              const response = await fetch(`https://hafiz899.pythonanywhere.com/api/track-order/${orderNum}/`);
        
                  if (response.ok) {
                       const data = await response.json();
                       setTrackingData(data);
                  }
                  else {
                    toast.error("Order not found or not placed yet.");
                  }
            }
            catch (error)
            {
               toast.error("Something went wrong");   
            }
          }

          const getBadge = (status) => {
            switch (status.toLowerCase()) {
                case 'order confirmed': return 'bg-info';
                case 'food being prepared': return 'bg-warning';
                case 'food pickup': return 'bg-primary';
                case 'food delivered': return 'bg-success';
                case 'order cancelled': return 'bg-danger';
                default: return 'bg-dark';
            }
          }

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
    <div className="container mt-4">
        <h3 className="mb-4"><i className="fas fa-map-marker-alt text-danger"></i>Track Your Order</h3>
        <div className="input-group mb-3 shadow-sm">
            <span className="input-group-text bg-white">
                <i className="fas fa-receipt text-muted"></i></span>
                <input
                type="text"
                className="form-control"
                placeholder="Enter Order Number"
                value={orderNumber}
                onChange={(e)=> setOrderNumber(e.target.value)}
                /> 
        </div>
        <button onClick={()=> handleTrack(orderNumber)} className="btn btn-primary mb-4">
            <i className="fas fa-truck me-1"></i>
              Track Order
        </button>
        {trackingData.length > 0 && (
            <div className="card p-4 shadow-sm rounded-4 border-0">
                <h5 className="mb-4 text-primary">
                    <i className="fas fa-stream me-1"></i>
                      Order Status Timeline
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-5 px-2 position-relative">
                    <div className="timeline-line"></div>
                    {trackingData.map((entry,index) => (
                        <div key={index} className="flex-fill timeline-step">
                            <div className={`icon text-white ${getBadge(entry.status)} mx-auto mb-2`}>
                                <i className="fas fa-check"></i>
                            </div>
                            <small className="fw-bold d-block">
                                {entry.status}
                            </small>

                            <small className="text-muted">
                                {new Date(entry.status_date).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>
                <h6 className="mb-2">Detailed History</h6>
                <ul className="list-group">
                    {trackingData.map((entry,index) => (
                        <li key={index} className="list-group-item">
                            <span className={`badge ${getBadge(entry.status)} me-2`}>{entry.status}</span>
                            {entry.remark}
                            <br/>
                            <small className="text-muted">
                                {new Date(entry.status_date).toLocaleDateString()}
                            </small>
                            {entry.order_cancelled_by_user && (
                              <span className={`badge ${getBadge(entry.status)} ms-2`}>Cancelled by user</span>  
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    </PublicLayout>

  )
}

export default TrackOrders
