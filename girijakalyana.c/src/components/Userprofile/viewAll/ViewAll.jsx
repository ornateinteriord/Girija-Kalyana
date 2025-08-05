import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  Box,
  Typography,
  Pagination,
} from "@mui/material";

import { useGetAllUsersProfiles } from "../../api/User/useGetProfileDetails";
import TokenService from "../../token/tokenService";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import GenderFilter from "../../../utils/Filters/GenderFilter";
import { LoadingTextSpinner } from "../../../utils/common";
import PageTitle from "../../UI/PageTitle";
import UserCard from "../../common/UserCard";

const itemsPerPage = 8;

const ViewAll = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    mutate: fetchProfiles,
    data,
    isPending: isLoading,
  } = useGetAllUsersProfiles();

  const handleStatusChange = useCallback((value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchProfiles({ page: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage, selectedStatus, fetchProfiles]);

  const filteredUsers = useMemo(() => {
    if (!data?.content) return [];

    return data.content.filter((user) => {
      if (selectedStatus !== "all" && user.gender !== selectedStatus)
        return false;
      return true;
    });
  }, [data, selectedStatus]);

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.totalRecords / itemsPerPage) : 1;
  }, [data]);

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 2 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontSize: { xs: '21px', sm: '25px' }, color: '#34495e',
                   mt:{xs:0},mb:{xs:1,md:2} }} fontWeight="500px">
                       Profiles
                     </Typography>

        <GenderFilter
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />
      </Box>
 { !isLoading &&  filteredUsers?.length === 0 ? (
        <Typography variant="h6" textAlign="center" mt={4}>
          No records to display.
        </Typography>
      ) : (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {filteredUsers.map((user)=>{
          return (
            <UserCard
              key={user._id}
              profile={user}
              onViewMore={handleOpenDialog}
              showCancelButton={false}
            />
          );
        })}
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

      {totalPages > 1 && (
        <Box display="flex" justifyContent="end" my={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={( e,page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size={window.innerWidth < 600 ? "small" : "medium"}
          />
        </Box>
      )}

      {isLoading && <LoadingTextSpinner />}
    </Box>
  );
};

export default ViewAll;
