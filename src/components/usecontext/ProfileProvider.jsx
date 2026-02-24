import { useState, useMemo } from "react";
import ProfileContext from "./ProfileContext";
import axios from "axios";
import TokenService from "../token/tokenService";


const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("currentProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const getProfileByRegistrationNo = async (registrationNo) => {
    if (!registrationNo) {
      throw new Error("Registration number is required");
    }

    try {
      const response = await axios.get(`/api/user/profile/${registrationNo}`, {
        headers: {
          Authorization: `Bearer ${TokenService.getToken()}`
        }
      });
      
      if (!response.data?.registration_no) {
        throw new Error("Invalid profile data received from server");
      }
      
      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  };

  // Use useMemo to optimize context value
  const contextValue = useMemo(() => ({
    profile,
    getProfileByRegistrationNo,
    setProfile: (newProfile) => {
      localStorage.setItem("currentProfile", JSON.stringify(newProfile));
      setProfile(newProfile);
    }
  }), [profile]); // Only recompute when profile changes

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;