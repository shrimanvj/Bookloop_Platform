import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Upload.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [requestDetails, setRequestDetails] = useState(null);
    const [rewardMessage, setRewardMessage] = useState('');
    const { token, userId } = useAuth();
    const navigate = useNavigate();
    const { requestId } = useParams();

    useEffect(() => {
        console.log('Upload component mounted with requestId:', requestId);
        if (!requestId) {
            console.error('Request ID is missing in Upload component');
            setError('Request ID is missing');
            return;
        }

        if (!token) {
            console.error('Authentication token is missing');
            setError('Please log in to upload files');
            return;
        }

        fetchRequestDetails();
    }, [requestId, token]);

    const fetchRequestDetails = async () => {
        try {
            console.log('Fetching request details for ID:', requestId);
            const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(errorData.error || 'Failed to fetch request details');
            }

            const data = await response.json();
            console.log('Received request details:', data);
            
            if (data.requesterId === userId) {
                throw new Error('You cannot fulfill your own request');
            }

            if (data.status !== 'pending') {
                throw new Error('This request has already been fulfilled');
            }

            setRequestDetails(data);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error fetching request details:', err);
            setError(err.message);
            setRequestDetails(null);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a PDF file');
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        if (!requestId) {
            setError('Request ID is missing');
            return;
        }

        if (!token) {
            setError('Authentication token is missing');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('requestId', requestId);

        try {
            console.log('Uploading file for request:', requestId);
            const response = await fetch(`http://localhost:5000/api/upload/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload file');
            }

            console.log('Upload successful:', data);
            setSuccess('File uploaded successfully!');
            setRewardMessage(data.rewardMessage || '');
            
            // Navigate back to requests page after 3 seconds
            setTimeout(() => {
                navigate('/requests');
            }, 3000);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message);
            setSuccess('');
            setRewardMessage('');
        }
    };

    if (!requestId) {
        return (
            <div className="upload-container">
                <h2>Upload Book</h2>
                <div className="error-message">Request ID is missing</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="upload-container">
                <h2>Upload Book</h2>
                <div className="error-message">{error}</div>
                <button onClick={() => navigate('/requests')} className="back-btn">
                    Back to Requests
                </button>
            </div>
        );
    }

    if (!requestDetails) {
        return (
            <div className="upload-container">
                <h2>Upload Book</h2>
                <div className="loading">Loading request details...</div>
            </div>
        );
    }

    return (
        <div className="upload-container">
            <h2>Upload Book</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {rewardMessage && <div className="reward-message">{rewardMessage}</div>}

            <div className="request-details">
                <h3>Request Details</h3>
                <p><strong>Title:</strong> {requestDetails.title}</p>
                <p><strong>Author:</strong> {requestDetails.author}</p>
                <p><strong>Description:</strong> {requestDetails.description}</p>
                <p><strong>Reward:</strong> ${requestDetails.reward}</p>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="file">Select PDF File</label>
                    <input
                        type="file"
                        id="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Upload File</button>
            </form>
        </div>
    );
};

export default Upload; 