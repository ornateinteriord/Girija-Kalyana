import { Navigate, Outlet } from "react-router-dom";
import TokenService from "../token/tokenService";




  const ProtectedRoute = ( {allowedRoles} ) => {
    const userRole = TokenService.getRole();
  
  
    if (!userRole) return <Navigate to="/" replace />;

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
      }
  
    return <Outlet />;
  };
   export default ProtectedRoute