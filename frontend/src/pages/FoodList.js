import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/home.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWishlist } from "../context/WishlistContext";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const { wishlistCount, setWishlistCount } = useWishlist();
  const userId = localStorage.getItem("userId");

  const foodsPerPage = 9;



  useEffect(() => {
    fetch("https://hafiz899.pythonanywhere.com/api/manage-foods/")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredFoods(data);
      });
    fetch("https://hafiz899.pythonanywhere.com/api/manage-category/")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
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

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    applyFilters(search, selectedCategory);
  }

  const sortFoods = (list,sortValue) => {
    const sorted = [...list];

    switch (sortValue) {
      case "priceLowHigh": // Ascending order
        sorted.sort (
          (a,b) => a.item_price - b.item_price
        );
        break;
      case "priceHighLow": // Descending order
        sorted.sort (
          (a,b) => b.item_price - a.item_price
        );
        break;
      case "nameAZ":  // Ascending order
        sorted.sort (
          (a,b) => a.item_name.localeCompare(b.item_name)
        );
        break;
      case "nameZA": // Descending order
        sorted.sort (
          (a,b) => b.item_name.localeCompare(a.item_name)
        );
        break;  
      default:
        // relevance = keep backend order
        break;  
    }
    return sorted;
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(search, category);
  }

  const applyFilters = (searchTerm, category, priceMin, priceMax, sortOverride) => {
    let result = foods;

    const min = typeof priceMin === "number" ? priceMin : minPrice;
    const max = typeof priceMax === "number" ? priceMax : maxPrice;
    const sortValue = sortOverride || sortBy;

    if (searchTerm) {
       result = result.filter(food=>food.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (category !='All') {
        result = result.filter(food=>food.category_name==category);
    }

    result = result.filter(food=>food.item_price>=min && food.item_price<=max);

    result = sortFoods(result,sortValue); 
    setFilteredFoods(result);
    setCurrentPage(1);
}
  // Pagination Logic      1 * 9
  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage; // 9-9

  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  const pagination = (pageNumber) => setCurrentPage(pageNumber);

  const handleMinPriceInput = (e) => {
    const value = parseFloat(e.target.value);
    setMinPrice(value);
    applyFilters(search, selectedCategory, value, maxPrice);
  }

  const handleMaxPriceInput = (e) => {
    const value = parseFloat(e.target.value);
    setMaxPrice(value);
    applyFilters(search, selectedCategory, value, minPrice);
  }

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    applyFilters(search, selectedCategory, minPrice, maxPrice, value);
  }

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
        <div className="container py-5">
            <h2 className="text-center mb-4 text-danger">Find Your Delicious Food Here...</h2>
            <div className="row mb-4">
                <div className="col-md-8">
                   <form onSubmit={handleSearch}>
                      <div className="input-group">
                        <input type="text"
                        className="form-control"
                        placeholder="Search your favourite food"
                        value={search}
                        onChange={handleSearch}
                        />
                        <button className="btn btn-warning" type="submit">
                            <i className="fa fa-search"></i>
                        </button>
                      </div>
                   </form>
                </div>
                <div className="col-md-4">
                   <select className="form-select"
                   value={selectedCategory}
                   onChange={handleCategoryChange}
                   >
                   <option value="All">All Categories</option>

                   {categories.map((cat)=> (
                    <option key={cat.id} value={cat.category_name}>{cat.category_name}</option>
                   ))}
                   </select>
                </div>
            </div>
            <div className="card mb-3 border-0 shadow-sm">
                <div className="card-body py-2">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label small mb-1">Sort:</label>
                      <select className="form-select form-select-sm"
                      value={sortBy}
                      onChange={handleSortChange}>
                        <option value="relevance">Relevance</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="nameAZ">Name: A - Z</option>
                        <option value="nameZA">Name: Z - A</option> 
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small mb-1">Min Price: ((Rs))</label>
                      <input type="number" className="form-control form-control-sm"
                      value={minPrice}
                      onChange={handleMinPriceInput}
                      min="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small mb-1">Max Price: ((Rs))</label>
                      <input type="number" className="form-control form-control-sm"
                      value={maxPrice}
                      onChange={handleMaxPriceInput}
                      max="0"
                      />
                    </div>
                  </div>
                </div>
            </div>
            <div className="row md-4">
               <div className="col-md-12">
                <label className="form-label fw-bold my-2">
                    Filter by Price: Rs.{minPrice} - Rs.{maxPrice}
                </label>
                <Slider range min={0} max={2000}
                 value={[minPrice, maxPrice]}
                 onChange={(value) => {
                    const [min, max] = value;
                    setMinPrice(value[0]);
                    setMaxPrice(value[1]);
                    applyFilters(search, selectedCategory, min, max);
                }}>
                </Slider>
                <button className="btn btn-outline-secondary btn-sm w-100 mt-3"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setMinPrice(0);
                  setMaxPrice(2000);
                  setSortBy("relevance");
                  setFilteredFoods(foods);
                  setCurrentPage(1);
                }}>
                  Clear Filter
                </button>
               </div>
            </div>
      <div className="row mt-4">
        {currentFoods.length === 0 ? (
          <p className="text-center">No foods found</p>
        ) : (
          currentFoods.map((food, index) => (
            <div className="col-md-4 mb-4">
              <div className="card hovereffect">
                <img
                  src={`https://hafiz899.pythonanywhere.com/media/${food.image}`}
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
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                  </h5>
                  <p className="card-text text-muted">
                    {food.item_description?.slice(0, 40)}...
                  </p>
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
      {totalPages > 1 && (
        <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                    <button className="page-link" onClick={()=>pagination(1)}>First</button>
                </li>
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                    <button className="page-link" onClick={()=>pagination(currentPage-1)}>Prev</button>
                </li>
                <li className='page-item disabled'>
                    <button className="page-link">Page {currentPage} of {totalPages}</button>
                </li>
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                    <button className="page-link" onClick={()=>pagination(currentPage+1)}>Next</button>
                </li>
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                    <button className="page-link" onClick={()=>pagination(totalPages)}>Last</button>
                </li>
            </ul>
        </nav>
      )}
    </div>
    </PublicLayout>
  );
};

export default FoodList;
