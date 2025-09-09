import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  TextField,
  Typography,
  InputAdornment,
  Box,
  useMediaQuery,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { getAllUserProfiles } from "../../api/Admin";
import toast from "react-hot-toast";
import {
  customStyles,
  getUserUpgradeColumns,
} from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";
import { useGetSearchProfiles } from "../../api/User";
import { debounce } from "./../../../utils/common/debounce";
import UserUpgradeDialog from "./UserUpgradeDialog";

const UserData = () => {
  // State
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
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
    data: searchedData = [],
    isFetching: isSearchLoading,
    refetch: searchUser,
  } = useGetSearchProfiles(search, true);

  // ✅ Normalize API data
  const users = Array.isArray(allUsersData?.content)
    ? allUsersData.content
    : [];
  const totalRecords = allUsersData?.totalRecords ?? 0;

  const searchedResult = Array.isArray(searchedData)
    ? searchedData
    : [];

  // Local cache
  const [localUsers, setLocalUsers] = useState(users);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounced search
 const debouncedSearchRef = useRef(
    debounce(async (searchValue) => {
      if (searchValue.trim()) {
        try {
          await searchUser();
        } catch (err) {
          toast.error(err?.message || "Search failed");
        }
      }
    }, 500)
  );

  // Update local users whenever API data changes
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Cancel debounce on unmount
   useEffect(() => {
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, []);

  // Fetch users when no search
  useEffect(() => {
    if (!search.trim()) {
      try {
        fetchUsers({
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
        });
      } catch (err) {
        toast.error(err?.message || "Failed to fetch users");
      }
    }
  }, [paginationModel, fetchUsers, search]);

  // Handle API errors
  useEffect(() => {
    if (isError && error?.message) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Upgrade handler
  const handleUpgrade = useCallback(
    async (row) => {
      setSelectedUser(row);
      setUpgradeDialogOpen(true);
    },
    []
  );

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value || "";
    setSearch(value);

    if (!value.trim()) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    } else {
      debouncedSearchRef.current?.(value);
    }
  };

  // Decide which data to show
  const displayData = search.trim() ? searchedResult : localUsers;

  // Columns
  const columns = useMemo(
    () => getUserUpgradeColumns(handleUpgrade, setUpgradeDialogOpen),
    [handleUpgrade, setUpgradeDialogOpen]
  );

  // Total rows
  const totalRows = search.trim() ? searchedResult.length : totalRecords;

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
      </Box>

      {/* DataTable */}
      <PaginationDataTable
        columns={columns}
        data={displayData}
        customStyles={customStyles}
        isLoading={isFetching || isSearchLoading}
        totalRows={totalRows}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No data available</Typography>}
        progressComponent={<LoadingTextSpinner />}
        disablePagination={!!search.trim()}
      />

      <UserUpgradeDialog
        open={upgradeDialogOpen}
        handleClose={() => setUpgradeDialogOpen(false)}
        defaultUserType={selectedUser?.type_of_user}
        userId={selectedUser?.registration_no}
        key={`upgrade-dialog-${selectedUser?.registration_no}`}
      />
    </Box>
  );
};

export default UserData;