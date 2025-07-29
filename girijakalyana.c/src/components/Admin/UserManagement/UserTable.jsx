import React, { useEffect, useState } from "react";
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
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles } from "../../api/Admin";
import toast from "react-hot-toast";
import { customStyles, getUserTableColumns } from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";

const UserTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const { data,   isLoading, isError, error, mutate: fetchUsers } = getAllUserProfiles();
  const users = data?.content || [];
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("status");

  useEffect(() => {
    fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (users && users.length > 0) {
      filterUsers(searchTerm, selectedUserType, selectedStatus);
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchTerm, selectedUserType, selectedStatus]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };

  const formatUserRole = (role) => {
    if (!role) return '';
    if (role.toLowerCase() === "assistance") return "Assistance";
    return role.replace('User', '').replace(/^\w/, c => c.toUpperCase());
  };

  const filterUsers = (search, userType, Status) => {
    let filtered = users.filter(user => {
      const isAdmin = user?.user_role?.toLowerCase() === "admin";
      return !isAdmin;
    });

    filtered = filtered.filter(user => {
      const username = user?.username?.toLowerCase() || '';
      const registration_no = user?.registration_no?.toLowerCase() || '';
      const searchLower = search.toLowerCase();
      return username.includes(searchLower) || registration_no.includes(searchLower);
    });

    if (Status !== "status") {
      filtered = filtered.filter(user => {
        const UserStatus = user?.status?.toLowerCase();
        switch (Status.toLowerCase()) {
          case "active":
            return UserStatus === "active";
          case "inactive":
            return UserStatus === "inactive";
          case "pending":
            return UserStatus === "pending";
          case "expires":
            return UserStatus === "expires";
          default:
            return true;
        }
      });
    }

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
            fontFamily={"Outfit sans-serif"}
          />
        </Box>
        
        <Box sx={{ 
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          width: { xs: '100%', md: 'auto' }
        }}>
          <FormControl sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            fontFamily: "Outfit sans-serif"
          }}>
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
          <FormControl sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            fontFamily: "Outfit sans-serif"
          }}>
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
        columns={getUserTableColumns(formatUserRole)}
        data={filteredUsers}
        customStyles={customStyles}
        isLoading={isLoading}
        totalRows={data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowsPerPageOptions={[6, 10, 15, 20, 50,1000]}
        noDataComponent={
          <Typography padding={3} textAlign="center" fontFamily="Outfit">
            No users found matching your criteria.
          </Typography>
        }
        progressComponent={<LoadingTextSpinner />}
      />
    </Box>
  );
};

export default UserTable;