import React, { useEffect, useState } from 'react'

const TopSellingProducts = () => {
    const [topFoods, setTopFoods] = useState([]);
    
        useEffect(() => {
            fetch("https://hafiz899.pythonanywhere.com/api/top-selling-foods/")
              .then((res) => res.json())
              .then((data) => {
                setTopFoods(data);
              });
          }, []);

  return (
    <div className='card shadow'>
        <h5 className='card-header bg-danger text-white'>
           <i className='fas fa-star me-2 text-warning'></i>
             Top 5 Selling Foods
        </h5>
        <div className='card-body'>
             <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Food Item</th>
                        <th>Total Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {topFoods.map((food,index) => (

                     <tr key={index}>
                        <td>{index+1}</td>
                        <td>{food.food__item_name}</td>
                        <td>{food.total_sold}</td>
                    </tr>
                    ))}
                </tbody>
             </table>
        </div>
    </div>
  )
}

export default TopSellingProducts
