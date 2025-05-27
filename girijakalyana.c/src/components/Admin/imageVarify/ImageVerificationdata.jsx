import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {
  customStyles,
  getImageVerificationColumns,
} from "../../../utils/DataTableColumnsProvider";
import { getAllUserProfiles, UpgradeUserStatus } from "../../api/Admin";
import {  TableLoadingComponent } from "../../../App";



const ImageVerificationData = () => {
  const { data: users = [], isLoading, isError, error } = getAllUserProfiles();
  const [localUsers, setLocalUsers] = useState(users);
  const [search, setSearch] = useState("");
  const upgradeUserMutation = UpgradeUserStatus();


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

const handleStatusUpdate = async(regno, currentStatus) => {
  try{
  const newStatus = currentStatus === "active" ? "pending" : "active";
  await upgradeUserMutation.mutateAsync({ 
    regno, 
    image_verification: newStatus, 
  },{
     onSuccess:()=>{
      setLocalUsers((prevUsers)=>
        prevUsers.map((user) =>
        user.registration_no === regno
      ?{...user,image_verification: newStatus}
      : user
        )
      )
     },
    onError: (error) => {
            console.error(error.message);
          }
  });
}
catch (err) {
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
      data.image_verification?.toLowerCase().includes(search.toLowerCase()) 
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
          sx={{textAlign:{xs:"center",sm:"left"},mb:"10px"}}
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
            sx={{ width: { xs: '100%',sm:"auto", md: 'auto' } }}
            variant="outlined"
          />
        </Box>

      {/* Data Table */}
      <DataTable
        columns={getImageVerificationColumns(upgradeUserMutation,handleStatusUpdate)}
        data={filteredRows}
        pagination
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        noDataComponent={
          <Typography padding={3} textAlign="center">
            No records found
          </Typography>
        }
        customStyles={customStyles}
        progressPending={isLoading}
       progressComponent={<TableLoadingComponent />}
       persistTableHead
       highlightOnHover
      />
    </Box>
  );
};

export default ImageVerificationData;
