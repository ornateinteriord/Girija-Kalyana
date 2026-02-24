import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Pagination,
  TextField,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useGetSearchProfiles } from "../../api/User";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import AboutPop from "../viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../viewAll/popupContent/preferencePop/PreferencePop";
import { LoadingTextSpinner } from "../../../utils/common";
import OthersPop from "../viewAll/popupContent/others/OthersPop";
import UserCard from "../../common/UserCard";

const itemsPerPage = 8;


const Search = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data = [], isFetching,refetch,isFetched } = useGetSearchProfiles(searchTerm);

  const handleSearch = () => {
   refetch()
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  const paginatedUsers = useMemo(() => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [data, currentPage]);

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  const renderDialogContent = () => {
    if (!selectedUser) return null;
    const contentMap = {
      0: <AboutPop userDetails={selectedUser} />,
      1: <FamilyPop userDetails={selectedUser} />,
      2: <EducationPop userDetails={selectedUser} />,
      3: <LifeStylePop userDetails={selectedUser} />,
      4: <PreferencePop userDetails={selectedUser} />,
      5: <OthersPop userDetails={selectedUser} />
    };
    return contentMap[currentTab] || null;
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 },  }}>
         <Typography variant="h5" sx={{ fontSize: { xs: '21px', sm: '25px' }, color: '#34495e',
                         mt:{xs:0},mb:{xs:1,md:2} }} fontWeight="500px">
                             Search Profiles
                           </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        

        <Box display="flex" gap={1} width={{ xs: "100%", sm: "70%" }}>
          <TextField
            size="medium"
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or registeration number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={isFetching || !searchTerm.trim()}
            sx={{ 
              whiteSpace: "nowrap", 
              textTransform: "capitalize", 
              width: "150px", 
              fontSize: "18px",
              position: 'relative'
            }}
          >
           
                <FaSearch style={{ marginRight: 6 }} />
                Search
          </Button>
        </Box>
      </Box>

      {isFetching ? (
        <LoadingTextSpinner />
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              mr:2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {paginatedUsers?.length > 0 && paginatedUsers.map((user)=>{
              return (
                <UserCard
                  key={user._id}
                  profile={user}
                  onViewMore={handleOpenDialog}
                  showCancelButton={false}
                />
              )
            })}
          </Box>

          {selectedUser && (
            <ProfileDialog
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              selectedUser={selectedUser}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isLoading={false}
              renderDialogContent={renderDialogContent}
            />
          )}

          {data.length > 0 && (
            <Box display="flex" justifyContent="end" my={3}>
              <Pagination
                count={Math.ceil(data.length / itemsPerPage)}
                page={currentPage}
                shape="rounded"
                onChange={(_e, page) => setCurrentPage(page)}
                color="primary"
                  size={window.innerWidth < 600 ? "small" : "medium"}
              />
            </Box>
          )}

          {/* Show message if no results found */}
          {isFetched && paginatedUsers?.length === 0 && (
            <Box mt={4} textAlign="center">
              <Typography color="red">No users found matching the input</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Search;