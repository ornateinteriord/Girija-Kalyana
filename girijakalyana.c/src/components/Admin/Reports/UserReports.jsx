import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles } from "../../api/Admin";
import { toast } from "react-toastify";
import {  TableLoadingComponent } from "../../../App";
import DataTable from "react-data-table-component";
import {
  customStyles,
  getUserReportsColumns,
} from "../../../utils/DataTableColumnsProvider";

const UserReports = () => {
  const { data: users = [], isLoading, isError, error } = getAllUserProfiles();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const filteredRecords = users.filter((record) => {
    return (
      search === "" ||
      record.registration_date
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.registration_no
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.first_name
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.gender?.toString().toLowerCase().includes(search.toLowerCase()) ||
      record.status?.toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box padding={2} marginTop={8}>
      <Box>
        <Typography
          variant="h4"
          color="#34495e"
          fontFamily={"Outfit sans-serif"}
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Users Reports
        </Typography>
      </Box>

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
        columns={getUserReportsColumns()}
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
        progressPending={isLoading}
        progressComponent={<TableLoadingComponent />}
        persistTableHead
        highlightOnHover
      />
    </Box>
  );
};

export default UserReports;
