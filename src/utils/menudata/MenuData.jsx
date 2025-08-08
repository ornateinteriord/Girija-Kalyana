import {
  FaUser,
  FaUsers,
  FaHeart,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaDashcube, FaUsersViewfinder } from "react-icons/fa6";

export const getMenuItems = ({
  handleDashboardClick,
  handleProfileClick,
  handleMatchesClick,
  handleInterestClick,
  handleViewAllClick,
  handleSearchClick,
  handleOpenLogoutDialog,
}) => [
  {
    text: "Dashboard",
    icon: <FaDashcube />,
    onClick: handleDashboardClick,
  },
  {
    text: "Profile",
    icon: <FaUser />,
    onClick: handleProfileClick,
  },
  {
    text: "My Matches",
    icon: <FaUsers />,
    onClick: handleMatchesClick,
  },
  {
    text: "My Interest",
    icon: <FaHeart />,
    onClick: handleInterestClick,
  },
  {
    text: "View All",
    icon: <FaUsersViewfinder />,
    onClick: handleViewAllClick,
  },
  {
    text: "Search",
    icon: <FaSearch />,
    onClick: handleSearchClick,
  },
  {
    text: "Logout",
    icon: <FaSignOutAlt />,
    onClick: handleOpenLogoutDialog,
  },
];
