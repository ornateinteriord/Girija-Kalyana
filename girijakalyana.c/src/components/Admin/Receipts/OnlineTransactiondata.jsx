import { useEffect, useState } from "react";
import { Box, TextField, Typography, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  customStyles,
  getOnlineTransactionColumns,
} from "../../../utils/DataTableColumnsProvider";
import { useOnlineTransactions } from "../../api/Admin";
import { toast } from "react-toastify";
import { LoadingTextSpinner } from "../../../utils/common";

const OnlineTransactionData = () => {
  const [search, setSearch] = useState("");

  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = useOnlineTransactions();
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = records.filter((data) => {
    return (
      search === "" ||
      (data.registration_no &&
        data.registration_no.toLowerCase().includes(search.toLowerCase())) ||
      (data.usertype &&
        data.usertype.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <Box p={2} marginTop={8}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "20px" }}
      >
        Online Transactions
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
          value={search}
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" }, mb: "20px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ marginRight: "8px" }}>
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DataTable
        columns={getOnlineTransactionColumns()}
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
        progressPending={isLoading}
        progressComponent={<LoadingTextSpinner />}
        persistTableHead
        highlightOnHover
      />
    </Box>
  );
};

export default OnlineTransactionData;
