import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaSearch, FaUsers } from "react-icons/fa";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  customStyles,
  getReceiptVoucherColumns,
} from "../../../utils/DataTableColumnsProvider";
import { TableLoadingComponent } from "../../../App";

const ReceiptVoucher = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => setRecords(res.data))
        .catch((err) => console.error(err));
    };
    fetchData();
  }, []);

  // Handle search filter
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Filter rows based on search
  const filteredRows = records.filter((data) => {
    return (
      search === "" ||
      data.id.toString().includes(search.toString()) ||
      data.name.toLowerCase().includes(search.toLowerCase()) ||
      data.username.toLowerCase().includes(search.toLowerCase()) ||
      data.email.toLowerCase().includes(search.toLowerCase()) ||
      data.phone.toLowerCase().includes(search.toLowerCase()) ||
      data.address.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box sx={{ padding: 4,  marginTop: "50px" }}>
      <Typography
        variant="h4"
        fontWeight={600}
        color="#34495e"
        marginRight={1}
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "20px" }}
      >
        Receipt Vocher
      </Typography>

      <TextField
        label="search"
        size="medium"
        variant="outlined"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
        sx={{ width: { xs: "100%", sm: "auto", md: "auto" }, mb: "20px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" style={{ marginRight: "8px" }}>
              <FaSearch />
            </InputAdornment>
          ),
        }}
      />

      {/* Cards Section */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        {[
          { count: 6, label: "Free Users", link: "View All" },
          { count: 2, label: "Premium Users", link: "View All" },
          { count: "$1", label: "Online Receipts", link: "View All" },
          { count: 6, label: "Renewals", link: "View All" },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{
            display: 'flex',
            justifyContent: 'center' // Center cards on all screen sizes
          }}
    >
            <Card variant="outlined" sx={{ width: "200px", height: "200px" }}>
              <CardContent
                sx={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontFamily: "Outfit sans-serif",
                }}
              >
                <Typography variant="h4" color="#182848">
                  {card.count}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 1,
                    color: "#182848",
                    fontWeight: 600,
                    fontFamily: "Outfit sans-serif",
                  }}
                >
                  {card.label}
                </Typography>
                <FaUsers
                  size={30}
                  style={{ marginTop: 10, color: "#182848", fontWeight: 600 }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  sx={{ width: "120px", fontFamily: "Outfit sans-serif" }}
                  size="small"
                  variant="outlined"
                >
                  {card.link}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DataTable
        columns={getReceiptVoucherColumns()}
        data={filteredRows}
        pagination
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        noDataComponent={
          <Typography padding={3} textAlign="center">
            No records found
          </Typography>
        }
        customStyles={customStyles}
        progressPending={false}
        progressComponent={ <TableLoadingComponent />}
        persistTableHead
        highlightOnHover
      />
    </Box>
  );
};

export default ReceiptVoucher;
