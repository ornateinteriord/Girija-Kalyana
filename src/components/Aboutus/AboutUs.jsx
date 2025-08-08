import React from "react";
import card4 from '../../assets/card4.jpg';
import './Aboutus.scss';
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const AboutUs = () => {
  return (
    <>
      <Navbar/>
      <div className="about-us-container">
        <section className="about-us-intro">
          <div className="about-us-text">
            <h4 className="highlight-text">About Us</h4>
            <h2 className="main-heading">GIRIJA KALYANA</h2>
          <h3 className="headingh3">
  Established in March 26<sup>th</sup> 2012
</h3>
            <p>
              At Ornate Pvt Ltd, we specialize in delivering state-of-the-art IT          
              solutions tailored to businesses of all sizes. With over a decade of experience,
              we've built trust and innovation as our cornerstones.
            </p>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div className="about-us-image">
            <img src={card4} alt="About Us" />
          </div>
        </section>

        <section className="about-us-services">
          <h3 className="section-title">What We Do</h3>
          <div className="services-grid">
            <div className="service-card">
              <h4>IT Solutions</h4>
              <p>Custom IT services designed to enhance your operational efficiency.</p>
            </div>
            <div className="service-card">
              <h4>Network Security</h4>
              <p>Secure your infrastructure with cutting-edge network solutions.</p>
            </div>
            <div className="service-card">
              <h4>Software Development</h4>
              <p>Tailored software applications for your unique business needs.</p>
            </div>
            <div className="service-card">
              <h4>Customer Support</h4>
              <p>24/7 support to ensure your operations run smoothly.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default AboutUs;