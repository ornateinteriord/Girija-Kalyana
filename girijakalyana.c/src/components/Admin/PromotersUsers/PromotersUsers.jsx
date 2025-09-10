import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {
  customStyles,
  getPromoterTableColumns,
} from "../../../utils/DataTableColumnsProvider";
import { getPromoterUsersList, getPromoterUsersStats } from "../../api/Admin";
import { LoadingTextSpinner } from "../../../utils/common";
import PromoterUsersListDialog from "./PromoterUsersListDialog";

const PromotersUsers = () => {
  const [promoterId, setPromoterId] = useState(null);
  const [search, setSearch] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const { data: PromoterStats = [], isFetching } = getPromoterUsersStats()
  const { data: PromoterUsers = [], refetch : fetchPromoterUsers , isFetching : isDetailsLoading} = getPromoterUsersList(promoterId);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    return ()=>{
      setPromoterId(null)
    }
  }, []);

  useEffect(() => {
  if (promoterId) {
    fetchPromoterUsers();
  }
}, [promoterId, fetchPromoterUsers]);


  const handleDetailsClick = (row) => {
    setPromoterId(row.promoter_id);
    setDetailsDialogOpen(true);
  }

  const filteredRows = PromoterStats.filter((row) => {
    const matchesSearch =
      search === "" ||
      row?.promoter_id.toString().includes(search) ||
      row.promoter_name.toLowerCase().includes(search.toLowerCase());

    return matchesSearch ;
  });

  return (
    <Box p={3} marginTop={8}>
      <Typography
        variant="h4"
        gutterBottom
        color="#34495e"
        fontWeight={600}
        fontFamily={"Outfit sans-serif"}
        sx={{ textAlign: { xs: "center", sm: "left" } }}
      >
        Promoter Users
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }} // Stack vertically on small screens, row on larger
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }} // Stretch on small, center on larger
        gap={2} // Add gap between items when stacked
        mb={2}
      >

        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: { xs: "100%", sm: "auto", md: "auto" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ marginRight: "8px" }}>
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper>
        <DataTable
          columns={getPromoterTableColumns(handleDetailsClick)}
          data={filteredRows}
          customStyles={customStyles}
          pagination
          paginationPerPage={20}
          paginationRowsPerPageOptions={[20, 40, 50, 100]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
          progressPending={isFetching}
          progressComponent={<LoadingTextSpinner />}
          noDataComponent={
            <Typography padding={3} textAlign="center">
              No promoters found
            </Typography>
          }
          persistTableHead
        />
      </Paper>
      <PromoterUsersListDialog 
        open={detailsDialogOpen} 
        onClose={()=>setDetailsDialogOpen(false)} 
        promoterId={promoterId} 
        PromoterUsers={PromoterUsers}
        isFetching={isDetailsLoading}
      />
    </Box>
  );
};

export default PromotersUsers;
