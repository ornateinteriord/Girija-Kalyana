import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {  TableLoadingComponent } from "../../../App";
import { customStyles, getRenewalsColumns } from "../../../utils/DataTableColumnsProvider";
import { getAllUserProfiles } from "../../api/Admin";
import { toast } from "react-toastify";

const RenewalsData = () => {
   const {data:users =[],isLoading,isError,error} = getAllUserProfiles()
  const [search, setSearch] = useState("");


 useEffect(() => {
      if (isError) {
        toast.error(error.message);
      }
    }, [isError, error]);

 

    const filteredRecords = users.filter((record) => {
      const isAdmin = record?.user_role?.toLowerCase() === "admin";
      const isPending =   ["pending", "inactive", "expires"].includes(record?.status.toLowerCase()) 
  
      return (
        !isAdmin &&
        isPending && // Only include pending users
        [
          record.registration_no?.toString().toLowerCase(),
          record.first_name?.toLowerCase(),
          record.username?.toLowerCase(),
          record.expiry_date?.toString().toLowerCase(),
          
        ].some((field) => field?.includes(search.toLowerCase()))
      );
    });


  return (
    <Box padding={2} marginTop={8} >
      
        <Typography
          variant="h4"
          gutterBottom
          color="#34495e"
          fontWeight={600}
          fontFamily={"Outfit sans-serif"}
          sx={{textAlign:{xs:"center",sm:"left"}}}
        >
          Renewals
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            placeholder="Search user"
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="medium"
            
            sx={{ width: { xs: '100%',sm:"auto", md: 'auto' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: "8px" }}>
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
        </Box>
     

      <DataTable
        columns={getRenewalsColumns()}
        data={filteredRecords}
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

export default RenewalsData;
