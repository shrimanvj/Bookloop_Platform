import React from 'react';
import './Terms.css';

const Terms = () => {
    return (
        <div className="terms-container">
            <h1>Terms of Service</h1>
            <div className="terms-content">
                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using BookLoop, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                </section>

                <section>
                    <h2>2. User Responsibilities</h2>
                    <p>
                        Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
                    </p>
                </section>

                <section>
                    <h2>3. Book Sharing Guidelines</h2>
                    <p>
                        Users must ensure that any books shared through the platform are legally obtained and shared in compliance with copyright laws.
                    </p>
                </section>

                <section>
                    <h2>4. Rewards and Payments</h2>
                    <p>
                        All rewards and payments are subject to our payment terms and conditions. Users must comply with the specified payment methods and procedures.
                    </p>
                </section>

                <section>
                    <h2>5. Content Guidelines</h2>
                    <p>
                        Users must not share inappropriate, offensive, or illegal content. BookLoop reserves the right to remove any content that violates these guidelines.
                    </p>
                </section>

                <section>
                    <h2>6. Privacy</h2>
                    <p>
                        Your use of BookLoop is also governed by our Privacy Policy. Please review our Privacy Policy for information about how we collect and use your data.
                    </p>
                </section>

                <section>
                    <h2>7. Modifications</h2>
                    <p>
                        BookLoop reserves the right to modify these terms at any time. Users will be notified of any changes.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms; 