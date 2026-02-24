import  { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { usePromotersTransactions } from "../../api/Admin";
import { customStyles, getPromotersTransactionsColumns } from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";


const PayToPromoterData = () => {
  const { data = [], isLoading, isError, error } = usePromotersTransactions(); 
  const [search, setSearch] = useState("");


  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);

 const filteredData = data.filter((item) =>
  [
    item.promocode,
    item.transaction_no,
    item.transaction_date,
    item.amount,
    item.mode_of_payment,
  ]
    .map(field => field?.toString().toLowerCase())
    .some(field => field.includes(search.toLowerCase()))
);


  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box sx={{ padding: 4, paddingTop: "85px" }}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "20px" }}
      >
        Pay to Promoters
      </Typography>

      <TextField
        placeholder="Search user"
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        sx={{ width: { xs: "100%", sm: "auto" }, mb: "20px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          ),
        }}
      />

      <DataTable
        columns={getPromotersTransactionsColumns()}
        data={filteredData}
        pagination
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        customStyles={customStyles}
        progressPending={isLoading}
        progressComponent={<LoadingTextSpinner />}
         persistTableHead
          highlightOnHover
        noDataComponent={
          <Typography padding={3} textAlign="center">
            No records found
          </Typography>
        }
      />
    </Box>
  );
};

export default PayToPromoterData;
