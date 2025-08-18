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
  // State management
  const [selectedStatus, setSelectedStatus] = useState("status");
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  
  // API calls
  const { 
    data, 
    isPending: isFetching, 
    isError, 
    error, 
    mutate: fetchUsers 
  } = getAllUserProfiles();
  
  const { 
    data: searchedResult = [], 
    isFetching: isSearchLoading, 
    refetch: searchUser 
  } = useGetSearchProfiles(search, true);

  // Data handling
  const users = data?.content || [];
  const [localUsers, setLocalUsers] = useState(users);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Memoized values
  const columns = useMemo(
    () => getUserDataColumns(UpgradeUserStatus(), handleUpgrade),
    []
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue) searchUser();
    }, 500),
    [searchUser]
  );

  // Effects
  useEffect(() => {
    if (users.length) setLocalUsers(users);
  }, [users]);

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

  // Handlers
  const handleUpgrade = async (regno, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await UpgradeUserStatus().mutateAsync(
        { 
          regno, 
          status: newStatus, 
          isProfileUpdate: newStatus === "active" 
        },
        {
          onSuccess: () => {
            setLocalUsers(prev => prev.map(user => 
              user.registration_no === regno ? { ...user, status: newStatus } : user
            ));
          },
          onError: (err) => console.error(err.message),
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) setPaginationModel(prev => ({ ...prev, page: 0 }));
    else debouncedSearch(value);
  };

  // Data processing
  const displayData = search ? searchedResult : localUsers;

  const filteredRows = useMemo(() => 
    displayData.filter(data => {
      if (data?.user_role?.toLowerCase() === "admin") return false;
      
      switch(selectedStatus.toLowerCase()) {
        case "active": return data.status === "active";
        case "inactive": return data.status === "inactive";
        case "pending": return data.status === "pending";
        case "expires": return data.status === "expires";
        default: return true;
      }
    }),
    [displayData, selectedStatus]
  );

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
    
      <Box 
        display="flex" 
        flexDirection={{ xs: "column", sm: "row" }} 
        gap={2}
        mb={3}
      >
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
        
        <FormControl sx={{ width: isMobile ? '100%' : 200 }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
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

      <PaginationDataTable
        columns={columns}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isFetching || isSearchLoading}
        totalRows={search ? searchedResult.length : data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No data available</Typography>}
        progressComponent={<LoadingTextSpinner />}
        disablePagination={!!search}
      />
    </Box>
  );
};

export default UserData;