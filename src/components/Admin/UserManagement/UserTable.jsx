import React, { useEffect, useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Box,
  Stack,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles, UpgradeUserStatus } from "../../api/Admin";
import toast from "react-hot-toast";
import { customStyles, getUserDataColumns, getUserTableColumns } from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";
import { useGetSearchProfiles } from "../../api/User";

const UserTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("status");

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
  } = useGetSearchProfiles(searchTerm, true);

  const upgradeUserMutation = UpgradeUserStatus()

  const users = data?.content || [];
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue) {
        searchUser();
      } else {
        fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
      }
    }, 500),
    [searchUser, fetchUsers, paginationModel]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Fetch users when pagination changes
  useEffect(() => {
    if (!searchTerm) {
      fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
    }
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers, searchTerm, upgradeUserMutation.isSuccess , upgradeUserMutation.isError]);

  // Handle API errors
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Filter users based on search and filters
  useEffect(() => {
    if (users && users.length > 0) {
      if (!searchTerm) {
        filterUsers(searchTerm, selectedUserType, selectedStatus);
      }
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchTerm, selectedUserType, selectedStatus]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };

  const formatUserRole = (role) => {
    if (!role) return '';
    if (role.toLowerCase() === "assistance") return "Assistance";
    return role.replace('User', '').replace(/^\w/, c => c.toUpperCase());
  };

  const filterUsers = (search, userType, status) => {
    let filtered = users.filter(user => {
      const isAdmin = user?.user_role?.toLowerCase() === "admin";
      return !isAdmin;
    });

    // Apply search filter if not using API search
    if (!searchTerm && search) {
      filtered = filtered.filter(user => {
        const username = user?.username?.toLowerCase() || '';
        const registration_no = user?.registration_no?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        return username.includes(searchLower) || registration_no.includes(searchLower);
      });
    }

    // Apply status filter
    if (status !== "status") {
      filtered = filtered.filter(user => {
        const userStatus = user?.status?.toLowerCase();
        switch (status.toLowerCase()) {
          case "active":
            return userStatus === "active";
          case "inactive":
            return userStatus === "inactive";
          case "pending":
            return userStatus === "pending";
          case "expires":
            return userStatus === "expires";
          default:
            return true;
        }
      });
    }

    // Apply user type filter
    if (userType !== "all") {
      filtered = filtered.filter(user => {
        const userRole = user?.user_role?.toLowerCase();
        switch (userType.toLowerCase()) {
          case "assistance":
            return userRole === "assistance";
          case "premium":
            return userRole === "premiumuser";
          case "silver":
            return userRole === "silveruser";
          case "free":
            return userRole === "freeuser";
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
  };

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
                        user?.registration_no === regno
                          ? { ...user, status: newStatus }
                          : user
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

  // Determine which data to display
  const displayData = searchTerm ? searchedResult : filteredUsers;
  const isLoadingData = isLoading || isSearchLoading;

   const columns = useMemo(
      () => getUserDataColumns(upgradeUserMutation, handleUpgrade),
      [upgradeUserMutation, handleUpgrade]
    );

  return (
    <Box sx={{ 
      padding: { xs: 2, sm: 3, md: 4 },
      marginTop: { xs: '60px', sm: '60px' },
      fontFamily: "Outfit, sans-serif",
      marginLeft: { xs: 0, sm: '20px' },
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Typography 
        variant="h4"
        fontWeight={600} 
        color="#34495e" 
        fontFamily={"Outfit sans-serif"} 
        marginBottom={3}
        sx={{ textAlign: isMobile ? 'center' : 'left' }}
      >
        User Table
      </Typography>
      
      {/* Filter Options */}
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={2} 
        mb={2} 
        justifyContent={'space-between'}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            fullWidth={isMobile}
            placeholder="Search by username or reference"
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: { xs: '100%', sm: '300px' },
              marginBottom: { xs: 0, md: 0 }
            }}
          />
        </Box>
        
        <Box sx={{ 
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          width: { xs: '100%', md: 'auto' }
        }}>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <Select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ height: '50px' }}
              fullWidth={isMobile}
            >
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="expires">Expires</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <Select 
              value={selectedUserType} 
              onChange={handleUserTypeChange}
              sx={{ height: '50px' }}
              fullWidth={isMobile}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="premium">Premium Users</MenuItem>
              <MenuItem value="silver">Silver Users</MenuItem>
              <MenuItem value="Assistance">Assistance Users</MenuItem>
              <MenuItem value="free">Free Users</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      
      {/* DataTable */}
      <PaginationDataTable
        columns={columns}
        data={displayData}
        customStyles={customStyles}
        isLoading={isLoadingData}
        totalRows={searchTerm ? searchedResult.length : data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowsPerPageOptions={[6, 10, 15, 20, 50, 1000]}
        noDataComponent={
          <Typography padding={3} textAlign="center" fontFamily="Outfit">
            No users found matching your criteria.
          </Typography>
        }
        progressComponent={<LoadingTextSpinner />}
        disablePagination={!!searchTerm} // Disable pagination when searching
      />
    </Box>
  );
};

export default UserTable;