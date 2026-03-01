import React from 'react';

const UserList = ({ users, onDeleteUser }) => {

    const handleDelete = (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            onDeleteUser(userId);
        }
    };

    return (
        <div className="admin-content-card">
            <h2 className="admin-content-title">Registered Users</h2>
            <div className="table-responsive">
                <table className="admin-table professional-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Joined On</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="user-name-cell">{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                {/* Provide a fallback of 0 for totalOrders */}
                                <td>{user.totalOrders || 0}</td>

                                {/* --- THIS IS THE FIX --- */}
                                {/* If user.totalSpent is undefined or null, it will use 0 instead. */}
                                <td>${(user.totalSpent || 0).toFixed(2)}</td>
                                
                                <td>
                                    <button className="btn-admin-action delete" onClick={() => handleDelete(user._id, user.name)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;