import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { customStyles, getPromotersDataColumns } from "../../../utils/DataTableColumnsProvider";

import { usePromoters, useUpdatePromoterStatus } from "../../api/Admin";
import { LoadingTextSpinner } from "../../../utils/common";


const PromotersData = () => {
  const { data = [], isLoading, isError, error } = usePromoters();
  const updateStatusMutation = useUpdatePromoterStatus(); 

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Updated to call the mutation:
  const handleStatusToggle = (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";

    updateStatusMutation.mutate({ id: row._id, status: newStatus });
  };

  const filteredData = data
    .filter((item) => {
      if (statusFilter === "all") return true;
      return item.status?.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((item) =>
      [item.promoter_name, item.mobile, item.email]
        .map((field) => field?.toString().toLowerCase())
        .some((val) => val?.includes(search.toLowerCase()))
    );

  return (
    <Box sx={{ padding: 4, paddingTop: "85px" }}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit, sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "20px" }}
      >
        Promoters
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        alignItems="center"
        mb={2}
      >
        <TextField
          placeholder="Search"
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "auto" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />

        <RadioGroup row value={statusFilter} onChange={handleStatusChange}>
          <FormControlLabel value="all" control={<Radio />} label="All" />
          <FormControlLabel value="active" control={<Radio />} label="Active" />
          <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
          <FormControlLabel value="pending" control={<Radio />} label="Pending" />
        </RadioGroup>
      </Box>

      <DataTable
        columns={getPromotersDataColumns(handleStatusToggle)}
        data={filteredData}
        pagination
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        customStyles={customStyles}
        progressPending={isLoading || updateStatusMutation.isLoading}
        progressComponent={<LoadingTextSpinner />}
        noDataComponent={
          <Typography padding={3} textAlign="center">
            No records found
          </Typography>
          
        }
        persistTableHead
          highlightOnHover
      />
    </Box>
  );
};

export default PromotersData;
