import { useEffect, useState } from "react";
import TokenService from "../token/tokenService";


const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!TokenService.getToken()
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const token = TokenService.getToken();
      setIsLoggedIn(!!token);
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  return { isLoggedIn };
};

export default useAuth;
