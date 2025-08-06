import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import { useGetReceivedInterests, useUpdateInterestStatus } from "../../../../api/User/useGetProfileDetails";
import TokenService from "../../../../token/tokenService";
import toast from "react-hot-toast";
import { LoadingTextSpinner } from "../../../../../utils/common";
import UserCard from "../../../../common/UserCard";

const Requests = ({refetchCounts}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const recipient = TokenService.getRegistrationNo();

  const {
    data: receivedInterests,
    isPending: isFetching,
    mutate: fetchReceivedInterests,
    isError,
    error,
  } = useGetReceivedInterests(recipient);

  const { mutate: updateInterest, } = useUpdateInterestStatus();

  useEffect(() => {
    fetchReceivedInterests({ page: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Something went wrong while fetching requests");
    }
  }, [isError, error]);

  const totalPages = useMemo(() => {
    return receivedInterests ? Math.ceil(receivedInterests.totalRecords / itemsPerPage) : 1;
  }, [receivedInterests]);

  const handleInterestResponse = (senderRefNo, isAccepted) => {
    updateInterest(
      {
        sender: senderRefNo,
        recipient,
        status: isAccepted ? "accepted" : "rejected",
      },
      {
        onSuccess: () => {
          toast.success(`Request ${isAccepted ? "accepted" : "rejected"} successfully`);
           fetchReceivedInterests({ page: currentPage - 1, pageSize: itemsPerPage });
           refetchCounts()
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to update request");
        },
      }
    );
  };

  const interests = receivedInterests?.content || [];

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: {xs: "center", sm: "flex-start"},
          mr:2,
          marginTop: 1,
        }}
      >
        {isFetching ? (
          <LoadingTextSpinner />
        ) : interests.length === 0 ? (
          <Typography variant="h6">No pending requests found</Typography>
        ) : (
          interests.map((interest) => (
            <UserCard
              key={interest._id}
              profile={interest.sender}
              onResponse={handleInterestResponse}
              showResponseButtons={true}
            />
          ))
        )}
      </Box>

      {totalPages > 1 && interests.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "end", marginTop: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            shape="rounded"
            color="primary"
            size={window.innerWidth < 600 ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
};

export default Requests;