import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {
  TextField,
  InputAdornment,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles, UserResetPassword } from "../../api/Admin";
import { LoadingComponent, TableLoadingComponent } from "../../../App";
import { toast } from "react-toastify";
import {
  customStyles,
  getResetPasswordColumns,
} from "../../../utils/DataTableColumnsProvider";
import "./Resetpassword.scss";

const ResetPassword = () => {
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { data: users = [], isLoading, isError, error } = getAllUserProfiles();
  const { mutateAsync: resetPassword, isPending } = UserResetPassword();

  if (isError) {
    toast.error(error.message);
  }

  const filteredRecords = users.filter((record) => {
    const isAdmin = record?.user_role?.toLowerCase() === "admin";
    return (
      !isAdmin &&
      [
        record.first_name,
        record.last_name,
        record.username,
        record.registration_no,
        record.password,
      ].some(
        (field) =>
          field && field.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  const handleSearch = (e) => setSearch(e.target.value);
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
      });
      handleCloseDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reset-password-user" style={{ padding: "20px" }}>
      
        <Typography
          variant="h4"
          fontWeight={600}
          color="#34495e"
          fontFamily={"Outfit sans-serif"}
          sx={{textAlign:{xs:"center",sm:"left"},mb:"10px"}}
        >
          Reset Password
        </Typography>

        <div className="search-div">
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            onChange={handleSearch}
            placeholder="Search records"
            autoComplete="off"
            sx={{ width: { xs: '100%',sm:"auto", md: 'auto' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: "8px" }}>
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
        </div>
     

      <Paper sx={{ mt: 2 }}>
        <DataTable
          columns={getResetPasswordColumns(handleOpenDialog)}
          data={filteredRecords}
          customStyles={customStyles}
          pagination
          paginationPerPage={6}
          paginationRowsPerPageOptions={[6, 10, 15, 20]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
          progressPending={isLoading}
          progressComponent={<TableLoadingComponent />}
          noDataComponent={
            <Typography padding={3} textAlign="center">
              No records found
            </Typography>
          }
           persistTableHead
          highlightOnHover
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            color: "#34495e",
            textTransform: "capitalize",
            fontWeight: 700,
          }}
        >
          Change Password
        </DialogTitle>
        <DialogContent>
          {isPending ? (
            <LoadingComponent />
          ) : (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isPending}
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="error"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordReset}
            sx={{ color: "#34495e" }}
            disabled={isPending || !newPassword || !confirmPassword}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
