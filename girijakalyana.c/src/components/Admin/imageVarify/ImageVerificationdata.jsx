import { useEffect, useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
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
  useMediaQuery,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { Close } from "@mui/icons-material";
import {
  customStyles,
  getImageVerificationColumns,
} from "../../../utils/DataTableColumnsProvider";
import { getAllUserProfiles, UpgradeUserStatus } from "../../api/Admin";
import { useGetSearchProfiles } from "../../api/User";
import { LoadingTextSpinner } from "../../../utils/common";
import { toast } from "react-toastify";

const ImageVerificationData = () => {
  // State management
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery('(max-width:600px)');

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

  const upgradeUserMutation = UpgradeUserStatus();

  // Data handling
  const users = data?.content || [];
  const [localUsers, setLocalUsers] = useState(users);
  const displayData = search ? searchedResult : localUsers;

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue) searchUser();
    }, 500),
    [searchUser]
  );

  // Effects
  useEffect(() => {
    if (!search) {
      fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
    }
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers, search]);

  useEffect(() => {
    if (users.length) setLocalUsers(users);
  }, [users]);

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError, error]);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Handlers
  const handleStatusUpdate = async (regno, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "pending" : "active";
      await upgradeUserMutation.mutateAsync(
        { regno, image_verification: newStatus },
        {
          onSuccess: () => {
            setLocalUsers(prev => prev.map(user => 
              user.registration_no === regno 
                ? { ...user, image_verification: newStatus } 
                : user
            ));
          },
          onError: (error) => toast.error(error.message),
        }
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  // Memoized columns
  const columns = useMemo(
    () => getImageVerificationColumns(upgradeUserMutation, handleStatusUpdate),
    [upgradeUserMutation, handleStatusUpdate]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, mt: 6 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        color="#34495e"
        fontFamily="Outfit"
        sx={{ textAlign: { xs: "center", sm: "left" }, mb: 2 }}
      >
        Image Verification
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <TextField
          placeholder="Search record"
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{ width: isMobile ? '100%' : 300 }}
          variant="outlined"
        />
      </Box>

      <PaginationDataTable
        columns={columns}
        data={displayData}
        customStyles={customStyles}
        isLoading={isLoading || isSearchLoading}
        totalRows={search ? searchedResult.length : data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowsPerPageOptions={[6, 10, 15, 20, 50]}
        noDataComponent={
          <Typography padding={3} textAlign="center">
            No records found
          </Typography>
        }
        progressComponent={<LoadingTextSpinner />}
        disablePagination={!!search}
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
          "&:hover": { backgroundColor: "#2e7d32" },
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
            <Box
              component="img"
              src={image}
              alt={`User ${id} image`}
              loading="lazy"
              sx={{
                width: "100%",
                height: 500,
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageVerificationData;