import { useEffect, useState } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {
  customStyles,
  getImageVerificationColumns,
} from "../../../utils/DataTableColumnsProvider";
import { getAllUserProfiles, UpgradeUserStatus } from "../../api/Admin";
import { Close } from "@mui/icons-material";
import { LoadingTextSpinner } from "../../../utils/common";
import { toast } from "react-toastify";


const ImageVerificationData = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const { data, isPending: isLoading, isError, error, mutate: fetchUsers } = getAllUserProfiles();
  const users = data?.content || [];
  const [localUsers, setLocalUsers] = useState(users);
  const [search, setSearch] = useState("");
  const upgradeUserMutation = UpgradeUserStatus();

  useEffect(() => {
    fetchUsers({ page: paginationModel.page, pageSize:paginationModel.pageSize});
  }, [paginationModel.page, paginationModel.pageSize,]);

  useEffect(() => {
    if (users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const handleStatusUpdate = async (regno, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "pending" : "active";
      await upgradeUserMutation.mutateAsync(
        {
          regno,
          image_verification: newStatus,
      
        },
        {
          onSuccess: () => {
            setLocalUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.registration_no === regno
                  ? { ...user, image_verification: newStatus }
                  : user
              )
            );
          },
          onError: (error) => {
            console.error(error.message);
          },
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };
  // Handle Search
  const filteredRows = localUsers.filter((data) => {
    const isAdmin = data?.user_role?.toLowerCase() === "admin";
    const matchesSearch =
      search === "" ||
      data.registration_no?.toString().includes(search.toString()) ||
      data.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      data.username?.toLowerCase().includes(search.toLowerCase()) ||
      data.gender?.toLowerCase().includes(search.toLowerCase()) ||
      data.user_role?.toLowerCase().includes(search.toLowerCase()) ||
      data.image_verification?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && !isAdmin;
  });

  return (
    <Box p={6} mt={6}>
      {/* Header & Controls */}

      <Typography
        variant="h4"
        fontWeight={600}
        color="#34495e"
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: "10px" }}
      >
        Image Verification
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        {/* Search Field */}
        <TextField
          placeholder="Search record"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
          variant="outlined"
        />
      </Box>

      {/* Data Table */}
      <PaginationDataTable
        columns={getImageVerificationColumns(upgradeUserMutation, handleStatusUpdate)}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isLoading}
        totalRows={data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowsPerPageOptions={[6, 10, 15, 20, 50]}
        noDataComponent={<Typography padding={3} textAlign="center">No records found</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />
    </Box>
  );
};

export const ViewImagesComponent = ({ image, id, loading }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#2e7d32",
          },
        }}
      >
        View
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          User Image
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
           <img
                    src={image}
                    alt={`Usr img`}
                    loading="lazy"
                    style={{ width: "100%",height: "500px", 
    objectFit: "contain",  borderRadius: 4 }}
                  />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageVerificationData;
