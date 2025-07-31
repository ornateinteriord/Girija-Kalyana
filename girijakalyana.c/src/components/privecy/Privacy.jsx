import React from "react";
import "./privacy.scss";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const Privacy = () => {
  return (
    <>
      <Navbar/>
      <div className="privacy-container">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p style={{color:'#fff'}}>Your privacy is our priority. Read how we protect your data.</p>
        </header>

        <section className="privacy-section">
          <h3>Our Privacy Policy</h3>
          <p>
            The terms "We" / "Us" / "Our"/"Company" individually and collectively refer to Kiran Computers Pvt Ltd and the terms "You" /"Your" / "Yourself" refer to the users. 
            This Privacy Policy is an electronic record in the form of an electronic contract formed under the Information Technology Act, 2000.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms, please do not use this Website.
          </p>
        </section>

        <section className="privacy-section">
          <h3>User Information</h3>
          <p>
            To avail certain services on our website, users are required to provide information like name, email address, sex, age, PIN code, and more. 
            This helps us improve our services and provide a better experience.
          </p>
        </section>

        <section className="privacy-section">
          <h3>Cookies</h3>
          <p>
            We may use cookies to enhance your browsing experience. Cookies help us understand your preferences and deliver personalized content.
          </p>
        </section>

        <section className="privacy-section">
          <h3>Link to Other Sites</h3>
          <p>
            Our privacy policy applies only to our website. Links to external sites are beyond our control.
          </p>
        </section>

        <section className="privacy-section">
          <h3>Information Sharing</h3>
          <p>
            We do not share your personal information without consent, except under legal obligations or regulatory requirements.
          </p>
        </section>

        <section className="privacy-section">
          <h3>Information Security</h3>
          <p>
            We implement strict security measures to protect your personal data from unauthorized access, disclosure, or destruction.
          </p>
        </section>

        <section className="grievance-section">
          <h3>Grievance Redressal</h3>
          <p>
            For any privacy concerns, contact our Grievance Officer:
          </p>
          <div className="contact-card">
            <h4>Mr. Nagaraj S (Grievance Officer)</h4>
            <ul>
              <li><strong>Company:</strong> Ornate Pvt. Ltd</li>
              <li><strong>Address:</strong> #148/E, 2nd Floor, 17th Main Vijaynagar, Bangalore-560040</li>
              <li><strong>Phone:</strong> 080 - 23409697</li>
              <li><strong>Email:</strong> ornateinteriod@example.com</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default Privacy;