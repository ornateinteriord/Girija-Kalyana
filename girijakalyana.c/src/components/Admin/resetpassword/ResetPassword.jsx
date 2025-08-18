import React, { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  TextField,
  InputAdornment,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  useMediaQuery
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles, UserResetPassword } from "../../api/Admin";
import { toast } from "react-toastify";
import {
  customStyles,
  getResetPasswordColumns,
} from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";
import { useGetSearchProfiles } from "../../api/User";

const ResetPassword = () => {
  // State management
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  
  // API calls
  const { 
    data, 
    isPending: isLoading, 
    isError, 
    error, 
    mutate: fetchUsers 
  } = getAllUserProfiles();
  
  const { 
    data: searchedResult = [], 
    isFetching: isSearchLoading, 
    refetch: searchUser 
  } = useGetSearchProfiles(search, true);
  
  const { mutateAsync: resetPassword, isPending: isResetting } = UserResetPassword();
  const isMobile = useMediaQuery('(max-width:600px)');

  // Data handling
  const users = data?.content || [];
  const displayData = search ? searchedResult : users;

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue) searchUser();
    }, 500),
    [searchUser]
  );

  // Effects
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    if (!search) {
      fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
    }
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers, search]);

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError, error]);

  // Memoized filtered rows
  const filteredRows = useMemo(() => 
    displayData.filter(record => {
      const isAdmin = record?.user_role?.toLowerCase() === "admin";
      if (isAdmin) return false;
      
      if (!search) return true;
      
      return [
        record?.first_name,
        record?.last_name,
        record?.username,
        record?.registration_no,
      ].some(field => field?.toString().toLowerCase().includes(search.toLowerCase()));
    }),
    [displayData, search]
  );

  // Handlers
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setOpenDialog(false);
  };

  const handlePasswordReset = async () => {
    if (!selectedUser) return;
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await resetPassword({
        regno: selectedUser.registration_no,
        password: newPassword,
      }, {
        onSuccess: () => {
          toast.success("Password reset successfully");
          fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
          handleCloseDialog();
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Memoized columns
  const columns = useMemo(
    () => getResetPasswordColumns(handleOpenDialog),
    [handleOpenDialog]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight={500}
        color="#34495e"
        fontFamily="Outfit"
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: 2 }}
      >
        Reset Password
      </Typography>

      <Box 
        sx={{ 
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
          value={search}
          placeholder="Search records"
          autoComplete="off"
          fullWidth={isMobile}
          sx={{ width: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <PaginationDataTable
        columns={columns}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isLoading || isSearchLoading}
        totalRows={search ? searchedResult.length : data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No records found</Typography>}
        progressComponent={<LoadingTextSpinner />}
        disablePagination={!!search}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: "#34495e", fontWeight: 400 }}>
          Change Password for {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isResetting}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isResetting}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={isResetting}
            sx={{ 
              color: "#fff",
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
              fontWeight: 400,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordReset}
            sx={{ 
              color: "#fff",
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              fontWeight: 400,
            }}
            disabled={isResetting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {isResetting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetPassword;