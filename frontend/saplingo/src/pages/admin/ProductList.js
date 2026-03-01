import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="admin-content-card">
            <div className="card-header">
                <h2 className="admin-content-title">Manage Products</h2>
                <button className="btn btn-primary">Create Product</button>
            </div>
            {loading ? <p>Loading products...</p> : 
             error ? <p className="api-message error">{error}</p> : (
                <div className="table-responsive">
                    <table className="admin-table professional-table">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id.toUpperCase().substring(product._id.length - 8)}</td>
                                    <td className="user-name-cell">{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.category}</td>
                                    <td>{product.countInStock}</td>
                                    <td>
                                        <button className="btn-admin-action edit">Edit</button>
                                        <button className="btn-admin-action delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;