import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import TokenService from "../../../../token/tokenService";
import { useGetAcceptedInterests, useRemoveAcceptedConnection } from "../../../../api/User";
import ProfileDialog from "../../../ProfileDialog/ProfileDialog";
import { LoadingTextSpinner } from "../../../../../utils/common";
import UserCard from "../../../../common/UserCard";

const Accepted = ({refetchCounts}) => {
  const registrationNo = TokenService.getRegistrationNo();
  const { data: responseData, isPending: isLoading, mutate: fetchAcceptedProfiles } = useGetAcceptedInterests(registrationNo);
  const { mutate: removeConnection, isPending: isRemoving } = useRemoveAcceptedConnection()

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedRemoveId, setSelectedRemoveId] = useState(null);
  const [removeConnectionConfirmOpen, setRemoveConnectionConfirmOpenOpen] = useState(false);

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

  const handleRemoveConnectionClick = useCallback((interestId) => {
    setSelectedRemoveId(interestId);
    setRemoveConnectionConfirmOpenOpen(true);
  }, []);

  const handleRemoveConnectionDialogClose = useCallback(() => {
    setSelectedRemoveId(null);
    setRemoveConnectionConfirmOpenOpen(false);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    const connectionToRemove = responseData?.content?.find((item) => item._id === selectedRemoveId);
    if (!connectionToRemove) return;

    console.log('connectionToRemove----> ', connectionToRemove)

    removeConnection(
      {
        sender: connectionToRemove.sender?.registration_no,
        recipient: registrationNo,
      },
      {
        onSuccess: () => {
          setSelectedRemoveId(null);
          setRemoveConnectionConfirmOpenOpen(false);
          fetchAcceptedProfiles({ page: currentPage - 1, pageSize: itemsPerPage }); // refresh after cancel
          refetchCounts()
        },
        onError: () => {
          toast.error("Failed to Remove Connection.");
          setRemoveConnectionConfirmOpenOpen(false);
        },
      }
    );
  }, [selectedRemoveId, responseData, removeConnection, registrationNo, fetchAcceptedProfiles, currentPage]);

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
          <Grid container spacing={2} sx={{ justifyContent: { xs: "center", sm: 'flex-start' }, mr: 2 }}>
            {interests.map((item, index) => {
              const profile = item.sender || {};
              return (
                <UserCard
                  key={index}
                  profile={profile}
                  interestId={item._id}
                  onViewMore={handleOpenDialog}
                  showRemoveButton={true}
                  onRemoveConnection={handleRemoveConnectionClick}
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

      <Dialog open={removeConnectionConfirmOpen} onClose={handleRemoveConnectionDialogClose}>
        <DialogTitle sx={{ fontWeight: 600, color: "black" }}>
          Remove Connection
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "black" }}>
            Are you sure you want to Remove this Connection?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleRemoveConnectionDialogClose}
            variant="outlined"
            sx={{
              textTransform: "capitalize",
              color: "black",
              borderColor: "black",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                borderColor: "black",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmRemove}
            color="error"
            variant="contained"
            disabled={isRemoving}
            sx={{
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accepted;
