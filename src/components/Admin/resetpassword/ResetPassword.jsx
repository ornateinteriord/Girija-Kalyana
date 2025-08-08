import React, { useState, useEffect } from "react";
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
  Paper,
  
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles, UserResetPassword } from "../../api/Admin";
import { LoadingComponent, } from "../../../App";
import { toast } from "react-toastify";
import {
  customStyles,
  getResetPasswordColumns,
} from "../../../utils/DataTableColumnsProvider";
import "./Resetpassword.scss";
import { LoadingTextSpinner } from "../../../utils/common";

const ResetPassword = () => {
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { data, isPending: isLoading, isError, error, mutate: fetchUsers } = getAllUserProfiles();
  const users = data?.content || [];
  const { mutateAsync: resetPassword, isPending } = UserResetPassword();
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

  if (isError) {
    toast.error(error.message);
  }

  const filteredRows = users.filter((record) => {
    const isAdmin = record?.user_role?.toLowerCase() === "admin";
    return (
      !isAdmin &&
      [
        record?.first_name,
        record?.last_name,
        record?.username,
        record?.registration_no,
        record?.password,
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
      },{
        onSuccess:()=>{
              fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
        },onError:(error) => {
          toast.error(error.message);
        }
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
          fontWeight={500}
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
     

      <PaginationDataTable
        columns={getResetPasswordColumns(handleOpenDialog)}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isLoading}
        totalRows={data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No records found</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            color: "#34495e",
            textTransform: "capitalize",
            fontWeight: 400,
          }}
        >
          Change Password
        </DialogTitle>
        <DialogContent>

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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={isPending}
             sx={{ color: "#fff",backgroundColor:"#f44336","&:hover": {backgroundColor:"#d32f2f"},fontWeight: 400, }}
          >
            Cancel
          </Button>
          <Button
           color="white"
            onClick={handlePasswordReset}
            sx={{ color: "#fff",backgroundColor:"#4caf50","&:hover": {backgroundColor:"#388e3c",},fontWeight: 400, }}
            disabled={isPending || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
