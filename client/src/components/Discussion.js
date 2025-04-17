import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Discussion = () => {
    const { bookId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, [bookId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/${bookId}`);
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(`http://localhost:5000/api/messages/${bookId}`, {
                userId: localStorage.getItem('userId') || 'anonymous',
                content: newMessage.trim()
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error posting message:', error);
        }
    };

    if (loading) {
        return <div>Loading discussion...</div>;
    }

    return (
        <div className="discussion-container">
            <h2>Discussion Thread</h2>
            <div className="messages-list">
                {messages.map(message => (
                    <div key={message.id} className="message">
                        <div className="message-header">
                            <span className="user">{message.userId}</span>
                            <span className="time">
                                {new Date(message.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="message-content">{message.content}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="message-form">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <button type="submit">Post Message</button>
            </form>
        </div>
    );
};

export default Discussion; 