import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    const features = [
        {
            icon: '📚',
            title: 'Request Books',
            description: 'Request any book you need and set your reward amount'
        },
        {
            icon: '💸',
            title: 'Earn Rewards',
            description: 'Upload books to fulfill requests and earn rewards'
        },
        {
            icon: '🤝',
            title: 'Community',
            description: 'Join a community of book lovers and share knowledge'
        },
        {
            icon: '🔒',
            title: 'Secure',
            description: 'Safe and secure platform for all your book needs'
        }
    ];

    return (
        <div className="landing-container">
            <section className="landing-header">
                <div className="header-content">
                    <div className="landing-logo">
                        <div className="logo-icon"></div>
                        <h1>BookLoop</h1>
                    </div>
                    <p className="tagline">Find, Share & Earn Through Knowledge</p>
                    <button className="get-started-btn" onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>
            </section>

            <section className="features-section">
                <h2>How It Works</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="steps-section">
                <h2>Simple Steps to Get Started</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create an Account</h3>
                        <p>Sign up or login to get started</p>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Request a Book</h3>
                        <p>Post your book request with reward amount</p>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Fulfill Requests</h3>
                        <p>Upload books to fulfill requests and earn rewards</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Start Your Book Journey?</h2>
                <button className="cta-button" onClick={handleGetStarted}>
                    Join BookLoop Now
                </button>
            </section>
        </div>
    );
};

export default LandingPage; 