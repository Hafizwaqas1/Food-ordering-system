import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { wishlistCount, setWishlistCount } = useWishlist();
  const [ratings, setRatings] = useState({});
  const [hovered, setHovered] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("https://hafiz899.pythonanywhere.com/api/random_foods/")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
      });
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`https://hafiz899.pythonanywhere.com/api/wishlist/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          const wishlistIds = data.map((item) => item.food_id);
          setWishlist(wishlistIds);
        });
    }
  }, [userId]);

  useEffect(() => {
    const fetchAllRatings = async () => {
      const allRatings = {};
      for (let food of foods) {
        const res = await fetch(
          `https://hafiz899.pythonanywhere.com/api/food-rating/${food.id}/`,
        );

        const data = await res.json();
        allRatings[food.id] = data;
      }
      setRatings(allRatings);
    };
    if (foods.length > 0) {
      fetchAllRatings();
    }
  }, [foods]);

  const toggleWishlist = async (foodId) => {
    if (!userId) {
      toast.info("Please logged in!");
      return;
    }
    const isWishlisted = wishlist.includes(foodId);
    const endpoint = isWishlisted ? "remove" : "add";

    try {
      const response = await fetch(
        `https://hafiz899.pythonanywhere.com/api/wishlist/${endpoint}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            food_id: foodId,
          }),
        },
      );

      if (response.ok) {
        setWishlist((prev) =>
          isWishlisted ? prev.filter((id) => id !== foodId) : [...prev, foodId],
        );

        const updatedCount = await fetch(
          `https://hafiz899.pythonanywhere.com/api/wishlist/${userId}`,
        );
        const wishlistData = await updatedCount.json();
        setWishlistCount(wishlistData.length);

        toast.success(
          isWishlisted ? "Remove from wishlist" : "Add to wishlist",
        );
      } else {
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <section
        className="hero py-5 text-center"
        style={{ backgroundImage: "url('/images/admin-bg.jpg')" }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "40px 20px",
            borderRadius: "10px",
          }}
        >
          <h1 className="display-5">
            Tasty & Delicious Food, Delivered to You
          </h1>
          <p className="lead">
            Craving something tasty? Let's get it to your door!
          </p>
          <form
            method="GET"
            action="/search"
            className="d-flex mt-3"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <input
              type="text"
              name="q"
              placeholder="I would like to eat..."
              className="form-control"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            />
            <button
              className="btn btn-warning px-4"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* random food item shows */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">
            Most Like Dishes This Month
            <span className="badge bg-danger ms-2">Top Picks</span>
          </h2>
          <div className="row mt-4">
            {foods.length === 0 ? (
              <p className="text-center">No foods found</p>
            ) : (
              foods.map((food, index) => (
                  console.log(food.image),

                <div className="col-md-4 mb-4" key={food.id}>
                  <div className="card hovereffect">
                    <div className="position-relative">
                      <img
                        src={`https://hafiz899.pythonanywhere.com${food.image}`}
                        alt={food.name}
                        className="card-img-top"
                        style={{ height: "180px" }}
                      />
                      <i
                        className={`${wishlist.includes(food.id) ? "fas" : "far"} fa-heart heart-icon position-absolute top-0 end-0 m-2 text-danger`}
                        style={{
                          cursor: "pointer",
                          background: "white",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => toggleWishlist(food.id)}
                      ></i>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                      </h5>
                      <p className="card-text text-muted">
                        {food.item_description?.slice(0, 40)}...
                      </p>
                      {ratings[food.id] && (
                        <div
                          className="mb-2 rating-wrapper position-relative"
                          onMouseEnter={() => setHovered(food.id)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <div>
                            <span className="text-warning">
                              {Array(Math.round(ratings[food.id].average))
                                .fill()
                                .map((_, index) => (
                                  <i key={index} className="fas fa-star"></i>
                                ))}
                              {Array(5 - Math.round(ratings[food.id].average))
                                .fill()
                                .map((_, index) => (
                                  <i key={index} className="far fa-star"></i>
                                ))}
                            </span>
                            <small className="text-muted ms-2">
                              {ratings[food.id].average} (
                              {ratings[food.id].total_reviews} ratings)
                            </small>
                          </div>
                          {hovered === food.id &&
                            ratings[food.id].breakdown && (
                              <div
                                className="hover-popup p-3 border rounded shadow position-absolute bg-white"
                                style={{
                                  bottom: "100%",
                                  width: "100%",
                                  marginBottom: "5px",
                                }}
                              >
                                {[5, 4, 3, 2, 1].map((star) => {
                                  const count =
                                    ratings[food.id].breakdown[star] || 0;
                                  const percentage = ratings[food.id]
                                    .total_reviews
                                    ? (count / ratings[food.id].total_reviews) *
                                      100
                                    : 0;

                                  return (
                                    <div
                                      key={star}
                                      className="d-flex align-items-center mb-1"
                                    >
                                      <small
                                        className="me-2"
                                        style={{ width: 50 }}
                                      >
                                        {star} star
                                      </small>
                                      <div className="progress flex-grow-1">
                                        <div
                                          className="progress-bar bg-warning"
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <small className="ms-2">{count}</small>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Rs. {food.item_price}</span>
                        {food.is_available ? (
                          <Link
                            to={`/food/${food.id}`}
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
      </section>
      <section className="py-5 bg-dark text-white">
        <div className="container text-center">
          <h2>Ordering in 3 Simple Steps</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <h4>1. Pick a dish you love</h4>
              <p>
                Explore hundreds of mouth-watering options and choose what you
                crave!
              </p>
            </div>
            <div className="col-md-4">
              <h4>2. Share your location</h4>
              <p>Tell us where you are, and we'll handle the rest.</p>
            </div>
            <div className="col-md-4">
              <h4>3. Enjoy doorstep delivery</h4>
              <p>
                Relax while your meal arrives fast and fresh - pay when it's
                delivered!
              </p>
            </div>
          </div>
          <p>Pay easily with Cash on Delivery - hassle-free!</p>
        </div>
      </section>
      <section className="py-5 bg-warning text-center text-dark">
        <h4>Ready to Satisfy Your Hunger?</h4>
        <Link to="/food-menu" className="btn btn-dark btn-lg">
          Browse Full Menu
        </Link>
      </section>
    </PublicLayout>
  );
};

export default Home;
