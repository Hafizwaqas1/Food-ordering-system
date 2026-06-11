import React, { useEffect, useState } from 'react';
import '../styles/admin.css';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({children}) => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [newOrders, setNewOrders] = useState(0);

    useEffect(() => {
                fetch("https://hafiz899.pythonanywhere.com/api/dashboard-metrics/")
                  .then((res) => res.json())
                  .then((data) => {
                    setNewOrders(data.new_orders);
                  });
              }, []);
        

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        }
        handleResize(); //initial check

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);


  return (
    <div className='d-flex'>
         { sidebarOpen && <AdminSidebar />}

         <div id="page-content-wrapper" className={`w-100 ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
              <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} newOrders={newOrders} />
              <div className='container-fluid mt-4'>
                   {children}  
              </div>
         </div>

    </div>
  )
}

export default AdminLayout
