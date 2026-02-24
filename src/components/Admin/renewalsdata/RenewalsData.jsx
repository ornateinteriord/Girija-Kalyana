import React, { useEffect, useState, useCallback, useMemo } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {
  customStyles,
  getRenewalsColumns,
} from "../../../utils/DataTableColumnsProvider";
import { getRenewalProfiles } from "../../api/Admin";
import { toast } from "react-toastify";
import { LoadingTextSpinner } from "../../../utils/common";
import UserUpgradeDialog from "../userData/UserUpgradeDialog";

const RenewalsData = () => {
  const { mutate, isPending: isLoading, isError, error } = getRenewalProfiles();

  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // API errors
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Fetch data whenever pagination/search changes
  useEffect(() => {
    mutate(
      {
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        search,
      },
      {
        onSuccess: (res) => {
          setUsers(res?.content || []);
          setTotalRecords(res?.totalRecords || 0);
        },
      }
    );
  }, [paginationModel.page, paginationModel.pageSize, search, mutate]);

  // Reset page when search changes
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [search]);

  // Open dialog
  const handleRenew = useCallback((row) => {
    setSelectedUser(row);
    setRenewDialogOpen(true);
  }, []);

  const columns = useMemo(() => getRenewalsColumns(handleRenew), [handleRenew]);

  return (
    <Box padding={2} marginTop={8}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit, sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" } }}
      >
        Renewals
      </Typography>

      {/* Search */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          placeholder="Search user"
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="medium"
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ marginRight: "8px" }}>
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* DataTable */}
      <PaginationDataTable
        columns={columns}
        data={users}
        customStyles={customStyles}
        isLoading={isLoading}
        totalRows={totalRecords}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No records found</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />

      {/* Same dialog as upgrade */}
      <UserUpgradeDialog
        open={renewDialogOpen}
        handleClose={() => setRenewDialogOpen(false)}
        defaultUserType={selectedUser?.type_of_user}
        userId={selectedUser?.registration_no}
        key={`renew-dialog-${selectedUser?.registration_no}`}
      />
    </Box>
  );
};

export default RenewalsData;
