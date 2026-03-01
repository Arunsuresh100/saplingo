import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import UserList from './UserList';
import ProductList from './ProductList';
import OrderList from './OrderList';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { userInfo, logout } = useUser();
    
    // --- State Management ---
    const [activeView, setActiveView] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchAdminData = async () => {
            if (!userInfo || !userInfo.token) return;
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const [usersRes, ordersRes, productsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/users', config),
                    axios.get('http://localhost:5000/api/admin/orders', config),
                    axios.get('http://localhost:5000/api/products', config)
                ]);

                // Create a map of user IDs to user names for quick lookups.
                const userMap = new Map(usersRes.data.map(user => [user._id, user.name]));

                // --- THIS IS THE FIX ---
                // This new logic correctly finds the user ID regardless of whether
                // 'order.user' is a simple string ID or an object containing the ID.
                const populatedOrders = ordersRes.data.map(order => {
                    const userId = typeof order.user === 'string' ? order.user : order.user?._id;
                    const userName = userMap.get(userId);

                    return {
                        ...order,
                        user: {
                            _id: userId,
                            name: userName || 'User Not Found' // Changed 'Deleted User' for clarity
                        }
                    };
                });

                setUsers(usersRes.data);
                setOrders(populatedOrders); // Set the state with the correctly populated order data
                setProducts(productsRes.data);
                
            } catch (err) {
                setError('Failed to fetch admin data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [userInfo]);

    // --- Event Handlers (No changes needed below this line) ---
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteUser = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data: updatedOrder } = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status }, config);
            
            const originalOrder = orders.find(o => o._id === orderId);
            if (originalOrder && originalOrder.user) {
                updatedOrder.user = originalOrder.user;
            }

            setOrders(orders.map(order => order._id === orderId ? updatedOrder : order));
        } catch (err) {
            alert('Failed to update order status.');
        }
    };

    // --- Derived Data for Rendering ---
    const totalUserCount = users.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const ordersToProcess = orders.filter(order => order.deliveryStatus === 'Processing').length;

    return (
        <>
            <UpdateOrderStatusModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onSave={handleUpdateOrderStatus}
            />
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <h1 className="admin-logo">Saplingo</h1>
                    <nav className="admin-nav">
                        <button className={`admin-nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>Dashboard</button>
                        <button className={`admin-nav-item ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')}>Users</button>
                        <button className={`admin-nav-item ${activeView === 'products' ? 'active' : ''}`} onClick={() => setActiveView('products')}>Products</button>
                        <button className={`admin-nav-item ${activeView === 'orders' ? 'active' : ''}`} onClick={() => setActiveView('orders')}>Orders</button>
                    </nav>
                    <div className="admin-sidebar-footer"><button onClick={handleLogout} className="btn-admin-logout">Logout</button></div>
                </aside>
                <main className="admin-content">
                    <header className="admin-header"><h3>Admin Dashboard</h3></header>
                    <section className="admin-main-section">
                        {loading ? <p>Loading Dashboard...</p> : 
                         error ? <p className="api-message error">{error}</p> :
                         (
                            <>
                                {activeView === 'dashboard' && (
                                    <div className="stats-grid">
                                        <div className="stat-card"><h4>Total Revenue</h4><p>${totalRevenue.toFixed(2)}</p></div>
                                        <div className="stat-card"><h4>Total Customers</h4><p>{totalUserCount}</p></div>
                                        <div className="stat-card"><h4>Total Products</h4><p>{products.length}</p></div>
                                        <div className="stat-card highlight"><h4>Orders to Process</h4><p>{ordersToProcess}</p></div>
                                    </div>
                                )}
                                {activeView === 'users' && <UserList users={users} onDeleteUser={handleDeleteUser} />}
                                {activeView === 'products' && <ProductList products={products} />}
                                {activeView === 'orders' && <OrderList orders={orders} onOpenModal={setSelectedOrder} />}
                            </>
                         )
                        }
                    </section>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;