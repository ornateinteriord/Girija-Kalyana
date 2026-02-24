import React, { useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";
import "./dashboard.scss";
import { getAllUserCounts } from "../../api/Admin";
import { toast } from "react-toastify";
import { LoadingTextSpinner } from "../../../utils/common";

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

const Dashboard = () => {
  const { data: usersObj = {}, isFetching: isLoading, isError, error } = getAllUserCounts();


  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const iconStyle = { fontSize: "50px", color: "#92d0f3" };

  const stats = [
    { count: usersObj?.freeUser, label: "Free Users", icon: <FaUsers style={iconStyle} />, link: "/admin/user-table" },
    { count: usersObj?.silverUser, label: "Silver Users", icon: <FaUsers style={iconStyle} />, link: "/admin/user-table" },
    { count: usersObj?.premiumUser, label: "Premium Users", icon: <FaUsers style={iconStyle} />, link: "/admin/user-table" },
    { count: usersObj?.totalPaidUsers, label: "Total Paid Users", icon: <FaUsers style={iconStyle} />, link: "/admin/onlinetransaction" },
    { count: usersObj?.assistancePending, label: "Assistance Pending", icon: <FaUsers style={iconStyle} />, link: "/admin/assistencepending" },
    { count: usersObj?.assistanceSuccess, label: "Assistance Success", icon: <FaUsers style={iconStyle} />, link: "/admin/assistencesuccess" },
    { count: 11332.86, label: "Paid User Receipts", icon: <MdCurrencyRupee style={iconStyle} />, link: "/admin/onlinetransaction" },
    { count: 10873.88, label: "Assistance Receipts", icon: <MdCurrencyRupee style={iconStyle} />, link: "/admin/assistanceonlinetransaction" },
    { count: 6646.0, label: "Renewal Receipts", icon: <MdCurrencyRupee style={iconStyle} />, link: "/admin/renewalreports" },
    { count: 12951.8, label: "Total Online Receipts", icon: <MdCurrencyRupee style={iconStyle} />, link: "/admin/receiptsvocher" },
  ];

  return (
    <div className="dashboard-content-main">
      {/* Cards Section */}
      {isLoading ? (
        <div className="dashboard-loading-wrapper">
          <LoadingTextSpinner />
        </div>
      ) : (
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
