import React, { useEffect, useState } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { customStyles, getRenewalsColumns } from "../../../utils/DataTableColumnsProvider";
import { getAllUserProfiles } from "../../api/Admin";
import { toast } from "react-toastify";
import { LoadingTextSpinner } from "../../../utils/common";

const RenewalsData = () => {
  const { data, isPending: isLoading, isError, error, mutate: fetchUsers } = getAllUserProfiles();
  const users = data?.content || [];
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Fetch users whenever page or pageSize changes
  useEffect(() => {
    fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers]);

  // Filter for renewals (pending/inactive/expires, not admin, and search)
  const filteredRows = users.filter((record) => {
    const isAdmin = record?.user_role?.toLowerCase() === "admin";
    const isPending = ["pending", "inactive", "expires"].includes(record?.status?.toLowerCase());
    return (
      !isAdmin &&
      isPending &&
      [
        record.registration_no?.toString().toLowerCase(),
        record.first_name?.toLowerCase(),
        record.username?.toLowerCase(),
        record.expiry_date?.toString().toLowerCase(),
      ].some((field) => field?.includes(search.toLowerCase()))
    );
  });

  return (
    <Box padding={2} marginTop={8}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" } }}
      >
        Renewals
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          placeholder="Search user"
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="medium"
          sx={{ width: { xs: '100%', sm: "auto", md: 'auto' } }}
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
        columns={getRenewalsColumns()}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isLoading}
        totalRows={data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No records found</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />
    </Box>
  );
};

export default RenewalsData;
