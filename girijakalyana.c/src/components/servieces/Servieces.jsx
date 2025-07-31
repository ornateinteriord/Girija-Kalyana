import React from "react";
import { LuNewspaper, LuCoffee } from "react-icons/lu";
import { IoSearchOutline, IoCallOutline } from "react-icons/io5";
import { TbUsers } from "react-icons/tb";
import { GrBook } from "react-icons/gr";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Servieces.scss";

const Services = () => {
const services = [
  {
    icon: <LuNewspaper style={{ fontSize: "40px", color: "#fff" }} />,
    title: "Share Your Responsibility",
    description:
      "A highly involved Relationship Manager understands your expectations and provides personalised assistance.",
  },
  {
    icon: <IoSearchOutline style={{ fontSize: "40px", color: "#fff" }} />,
    title: "Expert Search Within Reach",
    description:
      "Your Relationship Manager employs advanced tools and expert knowledge to find matching members from thousands of profiles.",
  },
  {
    icon: <GrBook style={{ fontSize: "40px", color: "#fff" }} />,
    title: "Shortlisted Matches",
    description:
      "Your Relationship Manager contacts prospects on your behalf and ensures effective communication between you and your matches.",
  },
  {
    icon: <IoCallOutline style={{ fontSize: "40px", color: "#fff" }} />,
    title: "Initiate Communication",
    description:
      "Your Relationship Manager carefully handpicks profiles that are most suitable for you and sends them for your review.",
  },
  {
    icon: <LuCoffee style={{ fontSize: "40px", color: "#fff" }} />,
    title: "Meet The Prospects",
    description:
      "Your Relationship Manager contacts prospects and facilitates a meeting based on mutual interest.",
  },
  {
    icon: <TbUsers style={{ fontSize: "40px", color: "#fff" }} />,
    title: "Happy Matches",
    description: "Assistance Service will be Started Shortly!",
  },
];


  return (
    <>
      <Navbar />
      <div className="servicebody">
      <h2 style={{ textTransform: "capitalize",
        marginTop:'25px',fontWeight:400,color:'#1a4f72' }}>Assisted Service Advantages</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="icon-wrapper">{service.icon}</div>
              <h3 style={{textTransform: "capitalize",fontWeight:400,}}>{service.title}</h3>
              <p style={{ color: '#fff', }}>{service.description}</p>
              {index < services.length - 1 && (
                <FaArrowAltCircleRight className="arrow-icon" />
              )}
            </div>
          ))}
        </div>
        <div className="happydiv">
          <p id="happy">Happy Assisted Marriages</p>
          <p>Assistance Service will be Started Shortly!</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;