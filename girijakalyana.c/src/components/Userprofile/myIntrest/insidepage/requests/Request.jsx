import React, { useState, useEffect } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import { useGetReceivedInterests, useUpdateInterestStatus } from "../../../../api/User/useGetProfileDetails";
import TokenService from "../../../../token/tokenService";
import toast from "react-hot-toast";
import InterestCard from "../../../intrestCard/IntrestCard";
import { LoadingComponent } from "../../../../../App";

const Requests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const recipient = TokenService.getRegistrationNo();

  const {
    data: receivedInterests = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReceivedInterests(recipient);

  const { mutate: updateInterest } = useUpdateInterestStatus();

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Something went wrong while fetching requests");
    }
  }, [isError, error]);

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
          refetch();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to update request");
        },
      }
    );
  };

  // Calculate pagination values
  const totalItems = receivedInterests?.length || 0;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  
  // Ensure current page stays within valid range
  const validCurrentPage = Math.min(currentPage, Math.max(pageCount, 1));
  
  const currentInterests = receivedInterests?.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  // Reset to page 1 if data changes and current page becomes invalid
  useEffect(() => {
    if (currentPage > pageCount && pageCount > 0) {
      setCurrentPage(1);
    }
  }, [pageCount, currentPage]);

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: currentInterests?.length > 0 ? "flex-start" : "center",
          marginTop: 1,
        }}
      >
        {isLoading ? (
          <LoadingComponent />
        ) : currentInterests?.length === 0 ? (
          <Typography variant="h6">No pending requests found</Typography>
        ) : (
          currentInterests?.map((interest) => (
            <InterestCard
              key={interest._id}
              senderData={interest.sender} // Pass the entire sender profile data // Pass the entire interest data if needed
              handleResponse={handleInterestResponse}
            />
          ))
        )}
      </Box>

      {pageCount > 1 && totalItems > 0 && (
        <Box sx={{ display: "flex", justifyContent: "end", marginTop: 4 }}>
          <Pagination
            count={pageCount}
            page={validCurrentPage}
            onChange={(_, page) => setCurrentPage(page)}
            shape="rounded"
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Requests;