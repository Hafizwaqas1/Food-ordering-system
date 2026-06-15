import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaEdit, FaFile, FaList, FaSearch, FaStar, FaThLarge, FaUsers } from 'react-icons/fa';


const AdminSidebar = () => {

    const [openMenus, setOpenMenus] = useState ({
        category: false,
        food: false,
        orders: false
    })

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({...prev, [menu]:!prev[menu]}));
    }


  return (
    <div className='bg-dark text-white sidebar'>
        <div className='text-center p-3 border-bottom'>
            <img src="/images/adminlogin.jpeg" className='img-fluid rounded-circle mb-2' width="70" alt="Admin Img"/>
            <h6 className='mb-0'>Admin</h6>
        </div>
        <div className='list-group list-group-flush'>
            <Link to="/admin-dashboard" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                <FaThLarge/>  Dashboard
            </Link>
            <div className='list-group list-group-flush'>
            <Link to="/manage-users" className='list-group-item list-group-item-action bg-dark text-white'>
                <FaUsers/>  Reg Users
            </Link>
        </div>
        <button onClick={()=>toggleMenu('category')} className='list-group-item list-group-item-action bg-dark text-white border-0'>
           <FaEdit/> Food Category {openMenus.category ? <FaChevronUp /> : <FaChevronDown/>}
        </button>
         {openMenus.category && (
        <div className='ps-4'>
            <Link to='/add-category' className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Add Category
            </Link>
            <Link to='/manage-category' className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Manage Category
            </Link>
        </div>
        )}
        <button onClick={()=>toggleMenu('food')} className='list-group-item list-group-item-action bg-dark text-white border-0'>
           <FaEdit/> Food Menu {openMenus.food ? <FaChevronUp /> : <FaChevronDown/>}
        </button>
        {openMenus.food && (
        <div className='ps-4'>
            <Link to='/add-food' className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Add Food 
            </Link>
            <Link to='/manage-food' className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Manage Food 
            </Link>
        </div>
         )}
         <button onClick={()=>toggleMenu('orders')} className='list-group-item list-group-item-action bg-dark text-white border-0'>
           <FaList/> Orders {openMenus.orders ? <FaChevronUp /> : <FaChevronDown/>}
        </button>
        {openMenus.orders && (
        <div className='ps-4'>
            <Link to="/orders-not-confirmed" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Not Confirmed 
            </Link>
            <Link to="/orders-confirmed" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Confirmed
            </Link>
            <Link to="/food_being_prepared" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Being Prepared
            </Link>
            <Link to="/foodpickup" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Food Pickup
            </Link>
            <Link to="/orders-delivered" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Delivered
            </Link>
            <Link to="/order-cancelled" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                Cancelled
            </Link>
            <Link to="/all-orders" className='list-group-item list-group-item-action bg-dark text-white border-0'>
                All Orders
            </Link>
        </div>
         )}
         
        <div className='list-group list-group-flush'>
            <Link to="/order-report" className='list-group-item list-group-item-action bg-dark text-white'>
                <FaFile/>  Reports
            </Link>
        </div>
        <div className='list-group list-group-flush'>
            <Link to="/search-order" className='list-group-item list-group-item-action bg-dark text-white'>
                <FaSearch/>  Search
            </Link>
        </div>
        <div className='list-group list-group-flush'>
            <Link to="/manage-reviews" className='list-group-item list-group-item-action bg-dark text-white'>
                <FaStar/>  Manage Reviews
            </Link>
        </div>
        </div>
        
    </div>
  )
}

export default AdminSidebar
