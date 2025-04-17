import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <h1>About BookLoop</h1>
            <div className="about-content">
                <p>
                    BookLoop is a platform that connects book lovers, allowing them to share and discover books while earning rewards.
                    Our mission is to create a community where knowledge is freely shared and valued.
                </p>
                <h2>Our Vision</h2>
                <p>
                    We envision a world where every book finds its reader and every reader finds their book,
                    creating a sustainable ecosystem of knowledge sharing.
                </p>
            </div>
        </div>
    );
};

export default About; 