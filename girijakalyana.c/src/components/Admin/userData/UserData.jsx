import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  InputAdornment,
  Box,
  useMediaQuery,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles, UpgradeUserStatus } from "../../api/Admin";
import toast from "react-hot-toast";
import { customStyles, getUserDataColumns } from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";
import { useGetSearchProfiles } from "../../api/User";

const UserData = () => {
  // State
  const [selectedStatus, setSelectedStatus] = useState("status");
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const isMobile = useMediaQuery("(max-width:600px)");

  // Get users (paginated)
  const {
    data: allUsersData,
    isPending: isFetching,
    isError,
    error,
    mutate: fetchUsers,
  } = getAllUserProfiles();

  // Get searched users
  const {
    data: searchedData,
    isFetching: isSearchLoading,
    refetch: searchUser,
  } = useGetSearchProfiles(search, true);

  // Always safe arrays
  const users = Array.isArray(allUsersData?.content) ? allUsersData.content : [];
  const searchedResult = Array.isArray(searchedData) ? searchedData : [];

  // Local cache for users
  const [localUsers, setLocalUsers] = useState(users);

  // Upgrade mutation
  const upgradeUserMutation = useMemo(() => UpgradeUserStatus(), []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.trim()) {
        try {
          await searchUser();
        } catch (err) {
          toast.error(err?.message || "Search failed");
        }
      }
    }, 500),
    [searchUser]
  );

  // Update local users whenever API data changes
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Cancel debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Fetch paginated users when no search
  useEffect(() => {
    try{
    if (!search.trim()) {
      fetchUsers({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
      })
    }
  } catch (err) {
    toast.error(err?.message || "Failed to fetch users");
  }
  }, [paginationModel, fetchUsers, search]);

  // API errors
  useEffect(() => {
    if (isError && error?.message) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Upgrade handler
  const handleUpgrade = useCallback(
    async (regno, currentStatus) => {
      try {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        await upgradeUserMutation.mutateAsync(
          {
            regno,
            status: newStatus,
            isProfileUpdate: newStatus === "active",
          },
          {
            onSuccess: () => {
              setLocalUsers((prev) =>
                Array.isArray(prev)
                  ? prev.map((user) =>
                      user?.registration_no === regno ? { ...user, status: newStatus } : user
                    )
                  : []
              );
            },
            onError: (err) => {
              toast.error(err?.message || "Failed to update user status");
            },
          }
        );
      } catch (err) {
        toast.error(err?.message || "An error occurred");
      }
    },
    [upgradeUserMutation]
  );

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value || "";
    setSearch(value);

    if (!value.trim()) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    } else {
      debouncedSearch(value);
    }
  };

  // Decide which data to show
  const displayData = search.trim() ? searchedResult : localUsers;

  // Filter rows by status (excluding admins)
  const filteredRows = useMemo(() => {
    return Array.isArray(displayData)
      ? displayData.filter((data) => {
          if (!data || data?.user_role?.toLowerCase() === "admin") return false;

          if (selectedStatus === "status") return true;
          return data?.status?.toLowerCase() === selectedStatus.toLowerCase();
        })
      : [];
  }, [displayData, selectedStatus]);

  // Columns
  const columns = useMemo(
    () => getUserDataColumns(upgradeUserMutation, handleUpgrade),
    [upgradeUserMutation, handleUpgrade]
  );

  // Total rows for pagination
  const totalRows = search.trim()
    ? searchedResult.length
    : allUsersData?.totalRecords || 0;

  return (
    <Box className="upgrade-user" sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        color="#34495e"
        fontFamily="Outfit"
        mb={3}
        textAlign={{ xs: "center", sm: "left" }}
      >
        Users Upgrade
      </Typography>

      {/* Filters */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={3}>
        <TextField
          label="Search"
          fullWidth={isMobile}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          onChange={handleSearchChange}
          value={search}
          placeholder="Search user"
        />

        <FormControl sx={{ width: isMobile ? "100%" : 200 }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value || "status")}
            sx={{ height: "50px" }}
          >
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="expires">Expires</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* DataTable */}
      <PaginationDataTable
        columns={columns}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isFetching || isSearchLoading}
        totalRows={totalRows}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No data available</Typography>}
        progressComponent={<LoadingTextSpinner />}
        disablePagination={!!search.trim()}
      />
    </Box>
  );
};

export default UserData;