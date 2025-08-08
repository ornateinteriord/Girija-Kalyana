import React, { useEffect, useState } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  Box,
  Typography,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllAssistanceSuccess, getAllUserProfiles } from "../../api/Admin";
import {
  customStyles,
  getAssistanceSuccessColumns,
} from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";


const SuccessData = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const { data, isPending: isLoading, isError, error, mutate: fetchUsers } = getAllAssistanceSuccess();
  const users = data?.content || [];
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = users.filter((data) => {
    const isAdmin = data?.user_role?.toLowerCase() === "admin";
   
    return (
      !isAdmin &&
      (search === "" ||
        data.registration_no
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        data.username
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.mobile_no
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.caste?.toString().toLowerCase().includes(search.toLowerCase()) ||
        data.type_of_user
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: "20px", paddingLeft: "30px", paddingTop: "100px" }}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "10px" }}
      >
        Success Data
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          placeholder="Search user"
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
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
      <PaginationDataTable
        columns={getAssistanceSuccessColumns()}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isLoading}
        totalRows={data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowsPerPageOptions={[6, 10, 15, 20, 50, 1000]}
        noDataComponent={<Typography padding={3}>No data available</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />
    </div>
  );
};

export default SuccessData;
