import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  Button,
} from "@mui/material";
import TokenService from "../../token/tokenService";
import { useGetMyMatches } from "../../api/User";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import {
  LoadingTextSpinner,
} from "../../../utils/common";
import PageTitle from "../../UI/PageTitle";
import UserCard from "../../common/UserCard";

const MyMatches = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const itemsPerPage = 8;

  const {
    mutate: fetchProfiles,
    data,
    isPending: isUsersLoading,
  } = useGetMyMatches();

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  useEffect(() => {
    fetchProfiles({ page: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage, fetchProfiles]);

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.totalRecords / itemsPerPage) : 1;
  }, [data]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: "#f9f9f9" }}>
    
           <Typography variant="h5" sx={{ fontSize: { xs: '21px', sm: '25px' }, color: '#34495e',
           mt:{xs:1},mb:{xs:2,md:2},textAlign:'left' }} fontWeight="500px">
               My Matches
             </Typography>

      {isUsersLoading ? (
        <LoadingTextSpinner />
      ) : data?.content?.length === 0 ? (
        <Typography variant="h6" textAlign="center" mt={4}>
          No matches found based on your preferences.
        </Typography>
      ) : (
        <Box
          sx={{
            display: {
              xs: "flex",
              sm: "grid",
            },
            flexDirection: "column",
            alignItems: "center",
            mr: 2,
            gridTemplateColumns: {
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {data?.content?.map((user, idx) => {
           return (
             <UserCard 
              key={`${user._id}-${idx}`}
              profile={user}
              onViewMore={handleOpenDialog}
              showCancelButton={false}
            />
           )
          })}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size={window.innerWidth < 600 ? "small" : "medium"}
          />
        </Box>
      )}

      {selectedUser && (
        <ProfileDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedUser={selectedUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isLoading={false}
        />
      )}
    </Box>
  );
};

export default MyMatches;
