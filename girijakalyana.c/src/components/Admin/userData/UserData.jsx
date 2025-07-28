import  { useEffect, useState } from "react";
import PaginationDataTable from "../../common/PaginationDataTable";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import "./UserData.css";
import { getAllUserProfiles, UpgradeUserStatus } from "../../api/Admin";
import toast from "react-hot-toast";
import { customStyles, getUserDataColumns } from "../../../utils/DataTableColumnsProvider";
import { LoadingTextSpinner } from "../../../utils/common";


const UserData = () => {
 const { data , isPending:isFetching, isError, error, mutate : fetchUsers } = getAllUserProfiles();
  const users = data?.content || []
  const [localUsers, setLocalUsers] = useState(users);
  const [selectedStatus, setSelectedStatus] = useState("status");
  const [search, setSearch] = useState("");
  
    const [paginationModel,setPaginationModel] = useState({page:0,pageSize:50})

  useEffect(() => {
    if (users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

  // Fetch users whenever page or pageSize changes
  useEffect(() => {
    fetchUsers({ page: paginationModel.page, pageSize: paginationModel.pageSize });
  }, [paginationModel.page, paginationModel.pageSize, fetchUsers]);

  const upgradeUserMutation = UpgradeUserStatus();

  const handleUpgrade = async (regno, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await upgradeUserMutation.mutateAsync(
        { regno, status: newStatus, },
        {
          onSuccess: () => {
            setLocalUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.registration_no === regno
                  ? { ...user, status: newStatus }
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

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const filteredRows = localUsers.filter((data) => {
    const isAdmin = data?.user_role?.toLowerCase() === "admin";
    const matchesSearch = 
      search === "" ||
      data.registration_no?.toString().includes(search.toString()) ||
      data.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      data.username?.toLowerCase().includes(search.toLowerCase()) ||
      data.gender?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = (() => {
      switch(selectedStatus.toLowerCase()) {
        case "active":
          return data.status === "active";
        case "inactive":
          return data.status === "inactive";
        case "pending":
          return data.status === "pending";
        case "expires":
          return data.status === "expires";
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && !isAdmin;
  });


  return (
    <div className="upgrade-user">
      
          <Typography
            variant="h4"
            fontWeight={600}
            color="#34495e"
            fontFamily={"Outfit sans-serif"}
            marginBottom={3}
            sx={{textAlign:{xs:"center",sm:"left"}}}
          >
            Users Upgrade
          </Typography>
        
     
        <div className="search-div">
          <TextField
            label="Search"
            id="search"
            sx={{ width: { xs: '100%',sm:"auto", md: 'auto' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user"
          />
          <FormControl  sx={{ 
      width: { xs: '100%', sm: '200px' },
      fontFamily: '"Outfit", sans-serif'
    }} fontFamily={"Outfit sans-serif"}>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ 
                height: "50px",
                width: '100%',
                '& .MuiSelect-select': { 
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="expires">Expires</MenuItem>
            </Select>
          </FormControl>
        </div>

      {/* DataTable */}
      <PaginationDataTable
        columns={getUserDataColumns(upgradeUserMutation, handleUpgrade)}
        data={filteredRows}
        customStyles={customStyles}
        isLoading={isFetching}
        totalRows={data?.totalRecords || 0}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        noDataComponent={<Typography padding={3}>No data available</Typography>}
        progressComponent={<LoadingTextSpinner />}
      />
    </div>
  );
};

export default UserData;