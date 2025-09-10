import React, { useState, useMemo } from "react";
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
import TransactionDetailsDialog from "./TransactionDetailsDialog";

const PromotersEarningsData = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPromoter, setSelectedPromoter] = useState(null);

  const {
    data: { aggregatedEarnings = [] } = {},
    isLoading,
    isError,
    error,
  } = usePromotersEarnings();

  const handleDetailsClick = (row) => {
    setSelectedPromoter(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPromoter(null);
  };

  const filteredRows = aggregatedEarnings.filter((data) => {
    const searchTerm = search.toLowerCase();
    return (
      search === "" ||
      data?.referal_by?.toLowerCase().includes(searchTerm) ||
      data?.emails?.some((email) => email?.toLowerCase().includes(searchTerm)) ||
      data?.mobiles?.some((mobile) => mobile?.toLowerCase().includes(searchTerm))
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
        placeholder="Search by promoter code, email, mobile"
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
        columns={getPromotersEarningsColumns(handleDetailsClick)}
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

      <TransactionDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        promoterCode={selectedPromoter?.referal_by}
      />
    </Box>
  );
};

export default PromotersEarningsData;
