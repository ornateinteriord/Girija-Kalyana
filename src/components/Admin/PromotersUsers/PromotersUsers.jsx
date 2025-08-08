import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import {
  customStyles,
  getPromoterTableColumns,
} from "../../../utils/DataTableColumnsProvider";

const PromotersUsers = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Users");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setRecords(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const filteredRows = records.filter((row) => {
    const matchesSearch =
      search === "" ||
      row.id.toString().includes(search) ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.username.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.phone.toLowerCase().includes(search.toLowerCase()) ||
      row.address?.city?.toLowerCase().includes(search.toLowerCase());

    // In a real app, you would filter by user type here
    const matchesFilter = filterType === "All Users" || true;

    return matchesSearch && matchesFilter;
  });

  return (
    <Box p={3} marginTop={8}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit sans-serif"}
        sx={{textAlign:{xs:"center",sm:"left"}}}
      >
        Promoter Users
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }} // Stack vertically on small screens, row on larger
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }} // Stretch on small, center on larger
        gap={2} // Add gap between items when stacked
        mb={2}
      >
         
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: "8px" }}>
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
        
          <FormControl  sx={{ 
      width: { xs: '100%', sm: '200px' },
      fontFamily: '"Outfit", sans-serif'
    }}>
            <InputLabel>Filter Users</InputLabel>
            <Select
              value={filterType}
              onChange={handleFilterChange}
              label="Filter Users"
            >
              <MenuItem value="All Users">All Users</MenuItem>
              <MenuItem value="premium">Premium Users</MenuItem>
              <MenuItem value="silver">Silver Users</MenuItem>
              <MenuItem value="free">Free Users</MenuItem>
            </Select>
          </FormControl>
      </Box>

      <Paper>
        <DataTable
          columns={getPromoterTableColumns()}
          data={filteredRows}
          customStyles={customStyles}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
          noDataComponent={
            <Typography padding={3} textAlign="center">
              No promoters found
            </Typography>
          }
          persistTableHead
        />
      </Paper>
    </Box>
  );
};

export default PromotersUsers;
