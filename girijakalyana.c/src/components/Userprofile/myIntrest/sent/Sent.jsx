import { useCallback, useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import TokenService from "../../../token/tokenService";
import { useCancelSentInterest, useGetSentInterests } from "../../../api/User";
import ProfileDialog from "../../ProfileDialog/ProfileDialog";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../../utils/common";
import UserCard from "../../../common/UserCard";

const Sent = ({refetchCounts}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const itemsPerPage = 4;
  const currentUserRegistrationNo = TokenService.getRegistrationNo();

  const { mutate: cancelInterest, isPending: isCancelling } = useCancelSentInterest();
  const {
    data: sentInterests,
    isPending: isLoading,
    mutate: fetchSentInterests,
  } = useGetSentInterests(currentUserRegistrationNo);

  // Fetch page-wise data whenever currentPage changes
  useEffect(() => {
    fetchSentInterests({ page: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage]);

  const totalPages = useMemo(() => {
    return sentInterests ? Math.ceil(sentInterests.totalRecords / itemsPerPage) : 1;
  }, [sentInterests]);

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  const handleRequestCancelClick = useCallback((interestId) => {
    setSelectedCancelId(interestId);
    setCancelConfirmOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    const interestToCancel = sentInterests?.content?.find((item) => item._id === selectedCancelId);
    if (!interestToCancel) return;

    cancelInterest(
      {
        sender: currentUserRegistrationNo,
        recipient: interestToCancel.recipientdata.registration_no,
      },
      {
        onSuccess: () => {
          setSelectedCancelId(null);
          setCancelConfirmOpen(false);
          fetchSentInterests({ page: currentPage - 1, pageSize: itemsPerPage }); // refresh after cancel
          refetchCounts()
        },
        onError: () => {
          toast.error("Failed to cancel request.");
          setCancelConfirmOpen(false);
        },
      }
    );
  }, [selectedCancelId, sentInterests, cancelInterest, currentUserRegistrationNo, fetchSentInterests, currentPage]);

  const handleCancelDialogClose = useCallback(() => {
    setSelectedCancelId(null);
    setCancelConfirmOpen(false);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {!isLoading && sentInterests?.content?.length === 0 ? (
        <Typography>You haven't sent any interest requests.</Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 3,
              placeItems: { xs: "center", sm: "flex-start" },
              mr: 2,
            }}
          >
            {sentInterests?.content?.map((interest) => (
              <UserCard
                key={interest._id}
                interestId={interest._id}
                profile={interest.recipientdata}
                onViewMore={handleOpenDialog}
                onCancelRequest={handleRequestCancelClick}
                showCancelButton={true}
              />
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                shape="rounded"
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

    <Dialog open={cancelConfirmOpen} onClose={handleCancelDialogClose}>
  <DialogTitle sx={{ fontWeight: 600, color: "black" }}>
    Cancel Request
  </DialogTitle>

  <DialogContent>
    <Typography sx={{ color: "black" }}>
      Are you sure you want to cancel this interest request?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={handleCancelDialogClose}
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
      No
    </Button>

    <Button
      onClick={handleConfirmCancel}
      color="error"
      variant="contained"
      disabled={isCancelling}
      sx={{
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: "#d32f2f",
        },
      }}
    >
      {isCancelling ? "Cancelling..." : "Cancel"}
    </Button>
  </DialogActions>
</Dialog>


      {isLoading && (
        <LoadingTextSpinner />
      )}
    </Box>
  );
};

export default Sent;
