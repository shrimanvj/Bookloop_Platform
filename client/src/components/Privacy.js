import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <h1>Privacy Policy</h1>
            <div className="privacy-content">
                <section>
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information that you provide directly to us, including your name, email address, and any other information you choose to provide.
                    </p>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect BookLoop and our users.
                    </p>
                </section>

                <section>
                    <h2>3. Information Sharing</h2>
                    <p>
                        We do not share your personal information with third parties except as described in this policy or with your consent.
                    </p>
                </section>

                <section>
                    <h2>4. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.
                    </p>
                </section>

                <section>
                    <h2>5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data.
                    </p>
                </section>

                <section>
                    <h2>6. Cookies and Tracking</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our service and hold certain information.
                    </p>
                </section>

                <section>
                    <h2>7. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy; 