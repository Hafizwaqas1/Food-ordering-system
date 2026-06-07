import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";


const ManageFood = () => {
    const [foods, setFoods] = useState([])
    const [allfoods, setAllFoods] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    
    const foodsPerPage = 6;

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/manage-foods/')
        .then(res => res.json())
        .then(data => {
            setFoods(data)
            setAllFoods(data)
        })
    }, []);

    const handleSearch = (s) => {
        const keyword = s.toLowerCase();
        
        if (!keyword) {
            setFoods(allfoods);

        } else {
            const filtered = allfoods.filter((c)=>c.item_name.toLowerCase().includes(keyword))
            setFoods(filtered); 
        }
    }

    const handleDelete = (id) => {
            if (window.confirm("Are you sure you want to delete this food item?")) {
                fetch(`http://127.0.0.1:8000/api/delete-food/${id}/`, {
                    method: 'DELETE',
    
                })
                .then(res => res.json())
                .then(data => {
                    toast.success(data.message);
                    setFoods(foods.filter(food=>food.id!==id));
                })
                .catch(err => console.error(err));
            }
        }

        // Pagination Logic      1 * 6
    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage; // 6-6

    const currentFoods = foods.slice(indexOfFirstFood, indexOfLastFood);
    const totalPages = Math.ceil(foods.length / foodsPerPage);

    const handlePagination = (page) => setCurrentPage(page);

  return (
    <AdminLayout>
        <ToastContainer position='top-right' autoClose={2000}/>
      <div>
          <h3 className="text-center text-primary mb-4">
            <i className="fas fa-list-alt me-1"></i>
            Manage Food Items
          </h3>
          <h5 className="text-end text-muted">
            <i className="fas fa-database me-1"></i>
            Total Food Items
            <span className="ms-2 badge bg-success">{foods.length}</span>
          </h5>
          <div className="mb-3 d-flex justify-content-between">
              <input type="text" className="form-control w-50" placeholder="Search by food name..." onChange={(e)=>handleSearch(e.target.value)}></input>

              <CSVLink data={foods} className="btn btn-success" filename={"food_list.csv"}>
                  <i className="fas fa-file me-2"></i>
                  Export to CSV
              </CSVLink>
          </div>

          <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                    <th>S.No</th>
                    <th>Category Name</th>
                    <th>Food Item Name</th>
                    <th>Action</th>
                </tr>
              </thead>
              <tbody>
                 {currentFoods.map((food,index)=>(
                <tr key={food.id}>
                    <td>{indexOfFirstFood + index + 1}</td>
                    <td>{food.category_name}</td>
                    <td>{food.item_name}</td>
                    <td>
                        <Link to={`/edit-food/${food.id}`} className="btn btn-sm btn-warning me-2">
                            <i className="fas fa-edit me-1"></i>Edit
                        </Link>
                        <button onClick={()=> handleDelete(food.id)} className="btn btn-sm btn-danger">
                            <i className="fas fa-trash-alt me-1"></i>Delete
                        </button>
                    </td>
                </tr>
                ))}
              </tbody>
          </table>
          <div className="mt-3 d-flex justify-content-center">
            <nav>
                <ul className="pagination">
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                          <button onClick={()=>handlePagination(page)} className="page-link">
                            {page}
                          </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageFood
