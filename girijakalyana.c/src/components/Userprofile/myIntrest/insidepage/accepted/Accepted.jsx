import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Pagination,
} from "@mui/material";
import TokenService from "../../../../token/tokenService";
import { useGetAcceptedInterests } from "../../../../api/User";
import ProfileDialog from "../../../ProfileDialog/ProfileDialog";
import { LoadingTextSpinner } from "../../../../../utils/common";
import UserCard from "../../../../common/UserCard";

const Accepted = () => {
  const registrationNo = TokenService.getRegistrationNo();
  const { data: responseData, isPending: isLoading, mutate: fetchAcceptedProfiles } = useGetAcceptedInterests(registrationNo);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchAcceptedProfiles({ page: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage]);

  const totalPages = useMemo(() => {
    return responseData ? Math.ceil(responseData.totalRecords / itemsPerPage) : 1;
  }, [responseData]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  const interests = responseData?.content || [];

  return (
    <Box sx={{ padding: 3 }}>
      {isLoading ? (
        <LoadingTextSpinner />
      ) : interests.length === 0 ? (
        <Typography variant="h6" textAlign="center" mt={4}>
          No accepted interests found
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{justifyContent: {xs:"center",sm:'flex-start'},mr: 2}}>
            {interests.map((item, index) => {
              const profile = item.sender || {};
              return (
                <UserCard 
                  key={index}
                  profile={profile}
                  onViewMore={handleOpenDialog}
                  showCancelButton={false}
                />
              );
            })}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "end", marginTop: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
                size={window.innerWidth < 600 ? "small" : "medium"}
              />
            </Box>
          )}
        </>
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

export default Accepted;
