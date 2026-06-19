import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import { getImageUrl } from "../utils/imageUrl";


const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const {wishlistCount, setWishlistCount} = useWishlist();
    
    const userId = localStorage.getItem('userId');

    const fetchWishlist = async () => {
    if (userId) {
      const res = await fetch(`https://hafiz899.pythonanywhere.com/api/wishlist/${userId}`);
      const data = await res.json();
      setWishlist(data);
    }
  }

  const removeFromWishlist = async (foodId) => {
  
      try {
        const response = await fetch(`https://hafiz899.pythonanywhere.com/api/wishlist/remove/`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               user_id: userId,
               food_id: foodId
            }),
           }); 
  
            if (response.ok) {
              
              const updatedCount = await fetch(`https://hafiz899.pythonanywhere.com/api/wishlist/${userId}`);
              const wishlistData = await updatedCount.json();
              setWishlistCount(wishlistData.length);
  
              toast.success("Remove from wishlist");
              fetchWishlist();
            }
            else {
              toast.error("Failed to update wishlist");
            }
      }
      catch (error)
      {
         toast.error("Something went wrong");   
      }
    }

    useEffect(() => {
       fetchWishlist();
      }, [userId]);

  return (
    <PublicLayout>
    <div className="container py-5">
       <h2 className="mb-4 text-center text-danger"><FaHeart className='text-danger me-2' size={40}/>My Wishlist</h2>
       <div className="row mt-4">
                   {wishlist.length === 0 ? (
                     <p className="text-center">No item in wishlist</p>
                   ) : (
                     wishlist.map((item, index) => (
                       <div className="col-md-4 mb-4" key={item.index}>
                         <div className="card hovereffect">
                           <div className="position-relative">
                             <img
                             src={getImageUrl(item.image)}
                             alt={item.name}
                             className="card-img-top"
                             style={{ height: "180px" }}
                           />
                           <i className="fas fa-heart heart-icon position-absolute top-0 end-0 m-2 text-danger"
                           style = {{
                                 cursor: "pointer",
                                 background: "white",
                                 width: "30px",
                                 height: "30px",
                                 borderRadius: "50%",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center"
                               }}
                               onClick={()=>removeFromWishlist(item.food_id)}
                               ></i>
                           </div>
                           <div className="card-body">
                             <h5 className="card-title">
                               <Link to={`/food/${item.food_id}`}>{item.item_name}</Link>
                             </h5>
                             <p className="card-text text-muted">
                               {item.item_description?.slice(0, 40)}...
                             </p>
                             <div className="d-flex justify-content-between align-items-center">
                               <span className="fw-bold">Rs. {item.item_price}</span>
                               {item.is_available ? (
                                 <Link
                                   to={`/food/${item.food_id}`}
                                   className="btn btn-outline-primary btn-sm"
                                 >
                                   <i className="fas fa-shopping-basket me-1"></i>
                                   Order Now
                                 </Link>
                               ) : (
                                 <div title="This food item is not available right now. Please check later.">
                                   <button className="btn btn-outline-secondary btn-sm">
                                     <i className="fas fa-times-circle me-1"></i>
                                     Currently Unavailable
                                   </button>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
            </div>
            </PublicLayout>
  )
}

export default Wishlist
