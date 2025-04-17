import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BookRequest.css';

const BookRequest = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [requests, setRequests] = useState([]);
    const { token, userId, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchRequests();
        }
    }, [isAuthenticated]);

    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            console.log('Fetched requests:', data);
            setRequests(data);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Failed to load requests');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isAuthenticated) {
            setError('Please log in to make a request');
            navigate('/login');
            return;
        }

        if (!token) {
            setError('Authentication token is missing');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    author,
                    description,
                    reward: parseFloat(reward)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create request');
            }

            const data = await response.json();
            setSuccess('Book request created successfully!');
            setTitle('');
            setAuthor('');
            setDescription('');
            setReward('');
            fetchRequests();
        } catch (err) {
            console.error('Request creation error:', err);
            setError(err.message || 'Failed to create request');
        }
    };

    const handleFulfill = (request) => {
        console.log('Handling fulfill for request:', request);
        
        if (!request) {
            console.error('Request object is missing');
            setError('Invalid request');
            return;
        }

        // Get the request ID, handling both id and _id fields
        const requestId = request._id || request.id;
        if (!requestId) {
            console.error('Request ID is missing in request object:', request);
            setError('Invalid request ID');
            return;
        }

        if (request.requesterId === userId) {
            setError('You cannot fulfill your own request');
            return;
        }

        if (request.status !== 'pending') {
            setError('This request has already been fulfilled');
            return;
        }

        if (!request.reward || request.reward <= 0) {
            setError('This request has no reward set');
            return;
        }

        console.log('Navigating to upload page with requestId:', requestId);
        navigate(`/upload/${requestId}`);
    };

    if (!isAuthenticated) {
        return (
            <div className="book-request-container">
                <h2>Book Requests</h2>
                <div className="error-message">
                    Please <a href="/login" className="login-link">log in</a> to view and create book requests
                </div>
            </div>
        );
    }

    return (
        <div className="book-request-container">
            <h2>Book Requests</h2>
            
            {error && <div className="error-message" key={`error-${Date.now()}`}>{error}</div>}
            {success && <div className="success-message" key={`success-${Date.now()}`}>{success}</div>}

            <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                    <label htmlFor="title">Book Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reward">Reward Amount ($)</label>
                    <input
                        type="number"
                        id="reward"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Submit Request
                </button>
            </form>

            <div className="requests-list">
                <h3>Recent Requests</h3>
                {requests.length === 0 ? (
                    <p className="no-requests">No requests found</p>
                ) : (
                    <div className="requests-grid">
                        {requests.map((request, index) => (
                            <div key={`request-${request._id}-${index}`} className="request-card">
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
                                {request.status === 'pending' && request.requesterId !== userId && (
                                    <button
                                        onClick={() => handleFulfill(request)}
                                        className="fulfill-btn"
                                    >
                                        Fulfill Request
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookRequest; 