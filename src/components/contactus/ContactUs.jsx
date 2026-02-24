import React, { useEffect } from "react";
import "./ContactUs.scss";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
  
      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h2>Get In Touch</h2>
          <p>
            We're here to assist you! Feel free to reach out to us with any
            questions, concerns, or feedback.
          </p>
        </div>

        <div className="contact-content-wrapper">
          <div className="contact-columns">
            {/* Left Column - Contact Form */}
          

            {/* Right Column - Contact Details + Map */}
            <div className="contact-details-column">
              <div className="contact-details">
                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaMapMarkerAlt className="icon" />
                  </div>
                  <div className="card-content">
                    <h3>Our Office</h3>
                    <p>#148/E, 2nd Floor, 17th Main Vijaynagar, Bangalore - 560040</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaEnvelope className="icon" /> 
                  </div>
                  <div className="card-content">
                    <h3>Email Us</h3>
                    <p>ornateinteriod@gmail.com</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="icon-wrapper">
                    <FaPhoneAlt className="icon" />
                  </div>
                  <div className="card-content">
                    <h3>Call Us</h3>
                    <p>+91 9148824442</p>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <h3 style={{color: '#1A4F72'}}>Our Location</h3>
                <div className="map-wrapper">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.041401723144!2d77.53727429999999!3d12.9692026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dde6dcd1763%3A0xfd2c0043be1b3327!2sOrnate%20Interior%20Decor%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1743154910866!5m2!1sen!2sin" 
                    width="100%" 
                    height="400" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Location Map"
                  ></iframe>
                </div>
              </div>
            </div>

              <div className="contact-form-column">
              <div className="form-header">
                <h3>Send Us a Message</h3>
                <p>We typically respond within 24 hours</p>
              </div>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" placeholder="John Doe" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" id="email" placeholder="john@example.com" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" placeholder="How can we help?" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" placeholder="Type your message here..." rows="5"></textarea>
                </div>
                
                <div className="button-group">
                  <button type="submit" className="subbtn">
                    Send Message
                  </button>
                  <button 
                    type="reset" 
                    className="clear-btn"
                    style={{backgroundColor: 'transparent', color: '#000', border: '1px solid #1A4F72'}}
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ContactUs;