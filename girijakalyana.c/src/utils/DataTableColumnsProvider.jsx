import React from "react";
import { Button, Typography } from "@mui/material";
import { ModeComment } from "@mui/icons-material";
import { getRelativeTime } from "./common/date";
import { ViewImagesComponent } from "../components/Admin/imageVarify/ImageVerificationdata";


export const customStyles = {
  headCells: {
    style: {
      fontFamily: "Outfit sans-serif",
      fontSize: "18px",
      fontWeight: "bold",
    },
  },
  cells: {
    style: {
      fontFamily: "Outfit sans-serif",
      fontSize: "17px",
    },
  },
};

export const getPromoterTableColumns = () => [
    {
      name: "Promoter's Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Promocode",
      selector: row => "-",
    },
    {
      name: "Mobile",
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: "Free Users",
      selector: row => "-",
    },
    {
      name: "Premium Users",
      selector: row => "-",
    },
    {
      name: "Silver Users",
      selector: row => "-",
    },
    {
      name: "Total Users",
      selector: row => "-",
    },
    {
      name: "Action",
      cell: () => (
        <Button variant="contained" size="small" sx={{ textTransform: 'capitalize' }}>
          DETAILS
        </Button>
      ),
    },
  ];
export const getPendingandSuccessUserDataColumns = () => [
    {
      name: "Registration No",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Caste",
      selector: () => "-",
    },
    {
      name: "User Type",
      selector: () => "Free/Silver User",
    },
  ];

export const getImageVerificationColumns = (upgradeUserMutation,handleStatusUpdate) => [
    {
      name: "Registration No",
      selector: (row) => row.registration_no,
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) =>row.gender ,
      sortable: true,
    },
    {
      name: "User Type",
      selector: (row) =>row.user_role ,
      sortable: true,
    },
    {
      name: "Image Status",
      cell: row => (
        <Typography color={row.image_verification === "active" ? "green" : "orange"}>
          {row.image_verification}
        </Typography>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          variant="contained"
          sx={{backgroundColor:row.image_verification ==="active" ?"orange":"green","&:hover":{backgroundColor:row.image_verification ==="active" ?"orange":"green"}}}
          size="small"
          onClick={() => handleStatusUpdate(row.registration_no, row.image_verification)}
          disabled={
            (upgradeUserMutation.isPending && upgradeUserMutation.variables?.regno === row.registration_no) || !row.image
          }
        >
          {upgradeUserMutation.isPending && upgradeUserMutation.variables?.regno === row.registration_no
            ? "Processing..."
            : row.image_verification === "active"
            ? "pending"
            : "active"}
        </Button>
      ),
    },
    {
  name: "Image",
  cell: (row) => (
      row.image?(<ViewImagesComponent
        image={row.image} 
        id={row.registration_no} 
        loading={upgradeUserMutation.isLoading}
      />):(<Typography variant="body2" color="textSecondary">
        Not Uploaded
      </Typography>)
   
  ),
}
  ];

export const getRenewalsColumns = () => [
    {
      name: "Registration No",
      selector: (row) => row.registration_no,
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Email Id",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: false,
    },
    {
      name: "Expiry Date",
      selector: (row) => row.expiry_date,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span style={{ color: "red", fontWeight: 500 }}>{row.status}</span>
      ),
    },
    {
      name: "Renewal",
      selector: () => "-",
    },
  ];

export const getResetPasswordColumns = (handleOpenDialog) =>  [
    {
      name: "Registration No",
      selector: (row) => row.registration_no,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Username",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Password",
      selector: (row) => row.password,
    },
    {
      name: "Status",
      cell: (row) => (
        <Typography color={row.status === "active" ? "green" : "red"}>
          {row.status}
        </Typography>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "capitalize",
            background: "#34495e",
          }}
          onClick={() => handleOpenDialog(row)}
        >
          Change Password
        </Button>
      ),
    },
  ];


  export const getPromotersUserDataColumns = (handleAction) => [
    {
      name: "Promoter Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Promocode",
      selector: (row) => "-",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Assistance Users",
      selector: (row) =>"-",
      sortable: true,
    },
    {
      name: "Total Users",
      selector: (row) => "-",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "capitalize",
            background: "#34495e",
          }}
          onClick={() => handleAction(row)}
        >
          Perform Action
        </Button>
      ),
    },
  ];

export const getPromotersDataColumns = (handleStatusChange) => [
  {
    name: "Promoter Name",
    selector: (row) => row.promoter_name || "-",
    sortable: true,
  },
  {
    name: "Promoter ID",
    selector: (row) => row.promoter_id || "-",
    sortable: true,
  },
  {
    name: "Mobile",
    selector: (row) => row.mobile || "-",
    sortable: true,
  },
  {
    name: "Email ID",
    selector: (row) => row.email || "-",
    sortable: true,
  },
  {
    name: "Membership",
    selector: (row) => row.membership_type || "-",
    sortable: true,
  },
  {
  name: "Status",
  cell: (row) => (
    <Typography color={row.status === "active" ? "green" : row.status === "inactive" ? "red" : "orange"}>
      {row.status === "active" ? "Active" : row.status === "inactive" ? "Inactive" : "Pending"}
    </Typography>
  ),
  sortable: true,
},
   {
    name: "Change Status",
    cell: (row) => (
      <Button
        variant="outlined"
        color={row.status === "active" ? "error" : "success"}
        onClick={() => handleStatusChange(row)}
      >
        {row.status === "active" ? "Inactive" : "Active"}
      </Button>
    ),
  },
];

export const getUserTableColumns = (formatUserRole) =>  [
    {
      name: "Sl.No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px"
    },
    {
      name: "Username",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Reference No",
      selector: row => row.registration_no,
      sortable: true,
    },
    {
      name: "Membership",
      cell: row => {
        const role = row?.user_role || row?.type_of_user;
        return (
        <Typography
          sx={{
            color: role === 'PremiumUser' ? '#FFD700' : 
                  role === 'SilverUser' ? '#C0C0C0' : 
                  role === 'FreeUser' ? '#4CAF50' :
                  role === 'Assistance' ? '#3498db' : '#333',
          }}
        >
          {formatUserRole(role)}
        </Typography>
      )
      },
      sortable: true,
    },
    {
      name: "Status",
      cell: row => (
        <Typography
          sx={{
            color: row.status === 'active' ? '#4CAF50' : '#F44336'
          }}
        >
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
        </Typography>
      ),
      sortable: true,
    },
    {
      name: "Last Login",
      selector: row => row.last_loggedin ? getRelativeTime(row.last_loggedin) : 'Never',
      sortable: true,
    },
  ];

export const getPromotersEarningsColumns = (handlePayNow) => [
  {
    name: "Promoter Code",
    selector: (row) => row.referal_by || "N/A",
    sortable: true,
  },
  {
    name: "Reference No",
    selector: (row) => row.ref_no ||  "N/A",
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.emailid ||  "N/A",
    sortable: true,
  },
  {
    name: "Mobile",
    selector: (row) => row.mobile || "N/A",
    sortable: true,
  },
  {
    name: "Total Earnings",
    selector: (row) => `₹${row.amount_earned || 0}`,
    sortable: true,
  },
  {
    name: "Transaction ID",
    selector: (row) => row.transaction_no || "N/A",
    sortable: false,
  },
  {
    name: "Txn Date",
    selector: (row) => row.transaction_date || "N/A",
    sortable: false,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <span style={{ color: row.status === "pending" ? "red" : "green" }}>
        {row.status}
      </span>
    ),
  },
  {
    name: "Action",
    cell: (row) =>
      row.status === "pending" ? (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handlePayNow(row)}
        >
          Pay Now
        </Button>
      ) : (
        "N/A"
      ),
  },
];

 export const getPromotersTransactionsColumns = () => [
  {
    name: "Promo Code",
    selector: (row) => row.promocode || "-",
    sortable: true,
  },
  {
    name: "Transaction ID",
    selector: (row) => row.transaction_no || "-",
    sortable: true,
  },
  {
    name: "Transaction Date",
    selector: (row) => row.transaction_date || "-",
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => `₹${row.amount || "0"}`,
    sortable: true,
  },
  {
    name: "Payment Mode",
    selector: (row) => row.mode_of_payment || "-",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    cell: (row) => (
      <Typography color={row.status === "active" ? "green" : "red"}>
        {row.status}
      </Typography>
    ),
    sortable: true,
  },
];

export const getUserDataColumns = (upgradeUserMutation, handleUpgrade) => [
    {
      name: "Registration No",
      selector: row => row.registration_no,
      sortable: true,
    },
    {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Email Id",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Gender",
      selector: row => row.gender,
      sortable: true,
    },
    {
      name: "User Type",
      selector: row => row.type_of_user,
      sortable: true,
    },
    {
      name: "Status",
      cell: row => (
        <Typography color={row.status === "active" ? "green" : "red"}>
          {row.status}
        </Typography>
      ),
      sortable: true,
    },
    {
      name: "Upgrade",
      cell: row => (
        <Button
          variant="contained"
          size="small"
          disabled={upgradeUserMutation.isPending && upgradeUserMutation.variables?.regno === row.registration_no}
          sx={{ textTransform: "capitalize",   backgroundColor: row.status === "active" ? "#f44336" : "#4caf50","&:hover": {
      backgroundColor: row.status === "active" ? "#d32f2f" : "#388e3c", 
    }, }}
          onClick={() => handleUpgrade(row.registration_no, row.status)}
        >
          {upgradeUserMutation.isPending && 
            upgradeUserMutation.variables?.regno === row.registration_no
            ? "Processing..."
            : row.status === "active"
            ? "Deactivate"
            : "Activate"}
        </Button>
      ),
    },
  ];

  export const getAssistancePendingColumns = () => [
    {
      name: "Registration No",
      selector: row => row.registration_no,
      sortable: true,
    },
    {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Phone",
      selector: row => row.mobile_no,
      sortable: true,
    },
    {
      name: "Caste",
      selector: row => row.caste,
      sortable: true,
    },
    {
      name: "User Type",
      selector: row => row.type_of_user,
      sortable: true,
    },

  ];

  export const getAssistanceSuccessColumns = () => [
    {
      name: "Registration No",
      selector: row => row.registration_no,
      sortable: true,
    },
    {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Phone",
      selector: row => row.mobile_no,
      sortable: true,
    },
    {
      name: "Caste",
      selector: row => row.caste,
      sortable: true,
    },
    {
      name: "User Type",
      selector: row => row.type_of_user,
      sortable: true,
    },

  ];


export const getOnlineTransactionColumns = (showActive) => [
  {
    name: "Date",
    selector: (row) => new Date(row.date).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "User Type",
    selector: (row) => row.usertype || "-",
    sortable: true,
  },
  {
    name: "Registration No",
    selector: (row) => row.registration_no,
    sortable: true,
  },
  {
    name: "Bank Reference Number",
    selector: (row) => row.bank_ref_num,
    sortable: true,
  },
  {
    name: "Mode Of Payment",
    selector: (row) => row.mode || "-",
    sortable: false,
  },
  {
    name: "Amount",
    selector: (row) => `Rs.${row.amount}`,
    sortable: true,
  },
  {
    name: "Status",
    cell: (row) => (
      <Typography color={row.status === "TXN_SUCCESS" ? "success.main" : "warning.main"}>
        {row.status}
      </Typography>
    ),
    sortable: true,
  },
];


  export const getAssistanceOnlineTransactionDataColumns = () => [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "UserName",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Registration No",
      selector: (row) => row.registration_no,
      sortable: true,
    },
    {
      name: "Bank Reference Number",
      selector: (row) => row.bank_ref_no,
      sortable: true,
    },
    {
      name: "Mode Of Payment",
      selector: (row) => row.mode,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Typography color={row.status === "TXN_SUCCESS" ? "green" : "red"}>
          {row.status}
        </Typography>
      ),
      sortable: true,
    },
  ];


  export const getReceiptVoucherColumns = () => [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Username",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.address.city,
      sortable: true,
    },
  ];


  export const getUserReportsColumns = () => [
    {
      name: "Activation Date",
      selector: (row) => row.registration_date,
      sortable: true,
    },
    {
      name: "Registration No",
      selector: (row) => row.registration_no,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Typography color={row.status === "active" ? "green" : "red"}>
          {row.status}
        </Typography>
      ),
      sortable: true,
    },
  ];

  export const getRenewalsReportColumns = () => [
    {
      name: "Transaction Date",
      selector: () => "09-10-2024",
      sortable: true,
    },
    {
      name: "Registration No",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Gender",
      selector: () => "-",
      sortable: false,
    },
    {
      name: "Status",
      cell: (row, index) => (
        <Typography
          variant="body2"
          color={index % 2 === 0 ? "success.main" : "error.main"}
        >
          {index % 2 === 0 ? "Active" : "Expires"}
        </Typography>
      ),
      sortable: true,
    },
  ];

  export const getReceiptsReportColumns = () => [
    {
      name: "Date",
      selector: () => "03-01-2025",
      sortable: true,
    },
    {
      name: "Registration No",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "UserName",
      selector: row => row?.username || row?.email_id,
      sortable: true,
    },
    {
      name: "Bank Reference Number",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Mode of Payment",
      selector: () => "-",
      sortable: false,
    },
    {
      name: "Amount",
      selector: () => "Rs.",
      sortable: false,
    },
    {
      name: "Status",
      cell: (row) => (
        <Typography
          color={row.id % 2 === 0 ? "success.main" : "error.main"}
          sx={{ fontFamily: "Outfit sans-serif", fontSize: "17px" }}
        >
          {row.id % 2 === 0 ? "Success" : "Pending"}
        </Typography>
      ),
      sortable: true,
    },
  ];

  export const getNotificationDataColumns = () => [
    {
      name: "News ID",
      selector: (row) => row.news_id,
      sortable: true,
    },
    {
      name: "News Details",
      selector: (row) => row.news_details,
      sortable: false,
    },
    {
      name: "From Date",
      selector: (row) => row.from_date,
      sortable: true,
    },
    {
      name: "To Date",
      selector: (row) => row.to_date,
      sortable: true,
    },
    {
      name: "Type Of News",
      selector: (row) => row.news_type,
      sortable: false,
    },
    {
      name: "Status",
      cell: (row) => (
        <Typography color={row.status === "active" ? "green" : "red"}>
          {row.status}
        </Typography>
      ),
      sortable: true,
    },
  ];


