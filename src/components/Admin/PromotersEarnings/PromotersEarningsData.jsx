import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";

import {
  customStyles,
  getPromotersEarningsColumns,
} from "../../../utils/DataTableColumnsProvider";
import { usePromotersEarnings } from "../../api/Admin";
import { LoadingTextSpinner } from "../../../utils/common";

const PromotersEarningsData = () => {
  const [search, setSearch] = useState("");

  // ✅ Use the custom hook
  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = usePromotersEarnings();

  // 🔍 Filter records based on search input
  const filteredRows = records.filter((data) => {
    const searchTerm = search.toLowerCase();
    return (
      search === "" ||
      data?.referal_by?.toLowerCase().includes(searchTerm) ||
      data?.emailid?.toLowerCase().includes(searchTerm) ||
      data?.mobile?.toLowerCase().includes(searchTerm) ||
      data?.transaction_no?.toLowerCase().includes(searchTerm) ||
      data?.ref_no?.toLowerCase().includes(searchTerm)
    );
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Box sx={{ padding: 4, paddingTop: "80px" }}>
      <Typography
        variant="h4"
        fontWeight={600}
        color="#34495e"
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "20px" }}
      >
        Promoters Earning
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        placeholder="Search by email, mobile, referral ID"
        value={search}
        onChange={handleSearchChange}
        sx={{ width: { xs: "100%", sm: "auto", md: "auto" }, mb: "20px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          ),
        }}
      />

      <DataTable
        columns={getPromotersEarningsColumns()}
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
            {isError ? error.message : "No records found"}
          </Typography>
        }
        customStyles={customStyles}
        progressPending={isLoading}
        progressComponent={<LoadingTextSpinner />}
        persistTableHead
          highlightOnHover
      />
    </Box>
  );
};

export default PromotersEarningsData;
