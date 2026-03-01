// import React, { useState } from 'react';

// const Profile = () => {
//     const [activeTab, setActiveTab] = useState('details');

//     return (
//         <>
//             {/* Header */}
//             <section className="profile-page">
//                 <div className="container">
//                     <h1>Your Account</h1>
//                     <div className="profile-layout">
//                         <div className="profile-nav">
//                             <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>My Details</button>
//                             <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Order History</button>
//                         </div>
//                         <div className="profile-details">
//                             {activeTab === 'details' && (
//                                 <>
//                                     <h2>My Details</h2>
//                                     {/* Form to edit user details */}
//                                 </>
//                             )}
//                             {activeTab === 'orders' && (
//                                 <>
//                                     <h2>Order History</h2>
//                                     <div className="order-history-item">
//                                         <p><strong>Order #12345</strong> - $60.98</p>
//                                         <p>Date: 2025-09-28</p>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             {/* Footer */}
//         </>
//     );
// };

// export default Profile;