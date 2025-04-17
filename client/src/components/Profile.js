import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [userRequests, setUserRequests] = useState([]);
    const [userFulfillments, setUserFulfillments] = useState([]);
    const [error, setError] = useState('');
    const { token, userId, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && userId && token) {
            fetchUserData();
            fetchUserRequests();
            fetchUserFulfillments();
        }
    }, [isAuthenticated, userId, token]);

    const fetchUserData = async () => {
        try {
            if (!userId || !token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`https://bookloop-platform.onrender.com/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
        }
    };

    const fetchUserRequests = async () => {
        try {
            if (!userId || !token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`https://bookloop-platform.onrender.com/api/requests/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user requests');
            }

            const data = await response.json();
            setUserRequests(data);
        } catch (err) {
            console.error('Error fetching user requests:', err);
            setError(err.message);
        }
    };

    const fetchUserFulfillments = async () => {
        try {
            const response = await fetch(`https://bookloop-platform.onrender.com/api/requests/fulfilled/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user fulfillments');
            const data = await response.json();
            setUserFulfillments(data);
        } catch (err) {
            setError('Failed to load user fulfillments');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="profile-container">
                <h2>Profile</h2>
                <div className="error-message">Please log in to view your profile</div>
            </div>
        );
    }

    const totalRewardsEarned = userFulfillments.reduce((total, request) => {
        const reward = parseFloat(request.reward) || 0;
        return total + reward;
    }, 0);

    const pendingRequests = userRequests.filter(request => request.status === 'pending').length;
    const fulfilledRequests = userRequests.filter(request => request.status === 'fulfilled').length;

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            
            {error && <div className="error-message">{error}</div>}

            {userData && (
                <div className="info-card">
                    <h3>User Information</h3>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Member since:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
                </div>
            )}

            <div className="stats-section">
                <h3>Your Statistics</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Total Requests</h4>
                        <p className="stat-number">{userRequests.length}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Pending Requests</h4>
                        <p className="stat-number">{pendingRequests}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Fulfilled Requests</h4>
                        <p className="stat-number">{fulfilledRequests}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Total Rewards Earned</h4>
                        <p className="reward-amount">${totalRewardsEarned.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="requests-section">
                <h3>Your Requests</h3>
                {userRequests.length === 0 ? (
                    <p className="no-requests">You haven't made any requests yet</p>
                ) : (
                    <div className="requests-grid">
                        {userRequests.map(request => (
                            <div key={request._id || request.id} className="request-card">
                                <h4>{request.title}</h4>
                                <p><strong>Author:</strong> {request.author}</p>
                                <p><strong>Description:</strong> {request.description}</p>
                                <p><strong>Reward:</strong> ${request.reward}</p>
                                <p className={`status ${request.status}`}>
                                    Status: {request.status}
                                </p>
                                {request.status === 'fulfilled' && (
                                    <p className="fulfilled-info">
                                        Fulfilled by: {request.fulfilledBy?.name || 'Another user'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fulfillments-section">
                <h3>Your Fulfillments</h3>
                {userFulfillments.length === 0 ? (
                    <p className="no-requests">You haven't fulfilled any requests yet</p>
                ) : (
                    <div className="requests-grid">
                        {userFulfillments.map(request => (
                            <div key={request._id || request.id} className="request-card">
                                <h4>{request.title}</h4>
                                <p><strong>Author:</strong> {request.author}</p>
                                <p><strong>Description:</strong> {request.description}</p>
                                <p><strong>Reward Earned:</strong> ${request.reward}</p>
                                <p className="status fulfilled">
                                    Status: Fulfilled
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 