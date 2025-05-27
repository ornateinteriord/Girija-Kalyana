import React, { useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";
import "./dashboard.scss";
import { getAllUserProfiles } from "../../api/Admin";
import {  TableLoadingComponent } from "../../../App";
import { toast } from "react-toastify";

// Reusable Card Component
const DashboardCard = ({ count, label, icon, link, style }) => {
  return (
    <div className="main-div-card">
      <div className="left-div">
        <div className="heading-div">
          <h1>{count}</h1>
          <p>{label}</p>
        </div>
        <div className="right-div">{icon}</div>
      </div>
      <div className="view-all-div" style={style}>
        <Link to={link || "#"}>View All</Link>
      </div>
    </div>
  );
};

const Dashboard=() =>{
const {data:users =[],isLoading,isError,error} = getAllUserProfiles()
const freeUsersCount = users.filter(user => user?.type_of_user?.toLowerCase() === "freeuser").length;
const silverUsersCount = users.filter(user => user?.type_of_user?.toLowerCase() === "silveruser").length;
const premiumUsersCount = users.filter(user => user?.type_of_user?.toLowerCase() === "premiumuser").length;
const PaidUsersCount = users.filter(
  user => ['silveruser', 'premiumuser'].includes(user?.type_of_user?.toLowerCase())
).length;
const AssistancePendingUsers = users.filter(user => user?.status?.toLowerCase() === "pending").length;
const AssistanceSuccessUsers = users.filter(user => user?.status?.toLowerCase() === "active").length;
  // Fetch users using async/await
   useEffect(() => {
       if (isError) {
         toast.error(error.message);
       }
     }, [isError, error]);

  // Define iconStyle before it is used
  const iconStyle = { fontSize: "50px", color: "#92d0f3" };

  const stats = [
    { count: freeUsersCount, label: "Free Users", icon: <FaUsers style={iconStyle} />,link: "/admin/user-table"  },
    { count: silverUsersCount, label: "Silver Users", icon: <FaUsers style={iconStyle} /> ,link: "/admin/user-table" },
    { count: premiumUsersCount, label: "Premium Users", icon: <FaUsers style={iconStyle} />,link: "/admin/user-table"  },
    { count: PaidUsersCount, label: "Total Paid Users", icon: <FaUsers style={iconStyle} />, link: "/admin/onlinetransaction" },
    { count: AssistancePendingUsers, label: "Assistance Pending", icon: <FaUsers style={iconStyle} />, link: "/admin/assistencepending" },
    { count: AssistanceSuccessUsers, label: "Assistance Success", icon: <FaUsers style={iconStyle} />, link: "/admin/assistencesuccess" },
    { count: 11332.86, label: "Paid User Receipts", icon: <MdCurrencyRupee style={iconStyle} />, link: "/admin/onlinetransaction" },
    { count: 10873.88, label: "Assistance Receipts", icon: <MdCurrencyRupee style={iconStyle} />, link: "/admin/assistanceonlinetransaction" },
    { count: 6646.0, label: "Renewal Receipts", icon: <MdCurrencyRupee style={iconStyle} />,link: "/admin/renewalreports"  },
    { count: 12951.8, label: "Total Online Receipts", icon: <MdCurrencyRupee style={iconStyle} />,link: "/admin/receiptsvocher"  },
  ];

  return (
    <div className="dashboard-content-main">
      {/* Cards Section */}
      {isLoading ? <TableLoadingComponent/> : (
         <div className="card-div">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            count={stat.count}
            label={stat.label}
            icon={stat.icon}
            link={stat.link}
          />
        ))}
      </div>
      )}
    </div>
  );
}

export default Dashboard;
