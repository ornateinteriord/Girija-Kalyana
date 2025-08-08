import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  customStyles,
  getReceiptsReportColumns,
} from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";

const ReceiptsReportsData = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredRecords = records.filter((data) => {
    return (
      search === "" ||
      data.id.toString().includes(search) ||
      data.name.toLowerCase().includes(search.toLowerCase()) ||
      data.username.toLowerCase().includes(search.toLowerCase()) ||
      data.email.toLowerCase().includes(search.toLowerCase()) ||
      data.phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  return (
    <Box padding={3} marginTop={8}>
      <Typography
        variant="h4"
        color="#34495e"
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" } }}
      >
        Receipts Reports
      </Typography>

      <Grid
        container
        spacing={2}
        alignItems="center"
        flexDirection={"row"}
        justifyContent={"space-between"}
        marginTop={1}
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
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
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "16px",
            width: { xs: "100%", sm: "auto", md: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
            value={fromDate}
            onChange={handleFromDateChange}
          />

          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={handleToDateChange}
            sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
          />
        
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "14px 22px",
              backgroundColor: "#34495e",
              textTransform: "capitalize",
            }}
          >
            Submit
          </Button>
        </Box>
      </Grid>

      <DataTable
        columns={getReceiptsReportColumns()}
        data={filteredRecords}
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
        progressComponent={ <LoadingTextSpinner />}
        persistTableHead
        highlightOnHover
      />
    </Box>
  );
};

export default ReceiptsReportsData;
