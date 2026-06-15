import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useLocation } from "react-router-dom";
import "../styles/home.css";

const SearchHome = () => {
  const query = new URLSearchParams(useLocation().search).get("q") || "";
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`https://hafiz899.pythonanywhere.com/api/food_search/?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setFoods(data);
        });
    }
  }, [query]);

  return (
    <PublicLayout>
      <div className="container py-4">
        <h3 className="text-center text-primary">Results for: {query}</h3>
        <div className="row mt-4">
          {foods.length === 0 ? (
            <p className="text-center">No foods found</p>
          ) : (
            foods.map((food, index) => (
              <div className="col-md-4 mb-4">
                <div className="card hovereffect">
                  <img
                    src={`https://hafiz899.pythonanywhere.com/media/${food.image}`}
                    alt={food.name}
                    className="card-img-top"
                    style={{ height: "180px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to="#">{food.item_name}</Link>
                    </h5>
                    <p className="card-text text-muted">
                      {food.item_description?.slice(0, 40)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Rs. {food.item_price}</span>
                      {food.is_available ? (
                        <Link to="" className="btn btn-outline-primary btn-sm">
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
  );
};

export default SearchHome;
