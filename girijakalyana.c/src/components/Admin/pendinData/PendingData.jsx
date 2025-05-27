import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  Stack,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles } from "../../api/Admin";
import {  TableLoadingComponent } from "../../../App";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import {
  customStyles,
  getAssistancePendingColumns,
} from "../../../utils/DataTableColumnsProvider";

const PendingData = () => {
  const { data: users = [], isLoading, isError, error } = getAllUserProfiles();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const filteredRecords = users.filter((record) => {
    const isAdmin = record?.user_role?.toLowerCase() === "admin";
    const isPending = record?.status?.toLowerCase() === "pending"; // Check if status is "pending"

    return (
      !isAdmin &&
      isPending && // Only include pending users
      [
        record.registration_no?.toString().toLowerCase(),
        record.first_name?.toLowerCase(),
        record.username?.toLowerCase(),
        record.mobile_no?.toString().toLowerCase(),
        record.caste?.toString().toLowerCase(),
        record.type_of_user?.toString().toLowerCase(),
      ].some((field) => field?.includes(search.toLowerCase()))
    );
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box p={5} marginTop={6}>
      <Typography
        variant="h4"
        color="#34495e"
        fontWeight={600}
        fontFamily="Outfit sans-serif"
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "10px" }}
      >
        Pending Data
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          label="Search"
          placeholder="Search user"
          value={search}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper>
        <DataTable
          columns={getAssistancePendingColumns()}
          data={filteredRecords}
          customStyles={customStyles}
          pagination
          paginationPerPage={6}
          paginationRowsPerPageOptions={[6, 10, 15, 20]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
            noRowsPerPage: false,
          }}
          noDataComponent={
            <Typography padding={3}>No data available</Typography>
          }
          progressPending={isLoading}
          progressComponent={<TableLoadingComponent />}
           persistTableHead
          highlightOnHover
        />
      </Paper>
    </Box>
  );
};

export default PendingData;
