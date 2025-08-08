import { jwtDecode } from "jwt-decode";
 
class TokenService {

  static setToken(token) {

    localStorage.setItem("token", token);

  }
 
  static getToken() {

    return localStorage.getItem("token");

  }
 
  static decodeToken() {

    const token = this.getToken();

    if (!token) return null;
 
    try {

      const decoded = jwtDecode(token);

      return decoded;

    } catch (error) {

      console.error("Invalid token", error);

      return null;

    }

  }
 
  static getRole() {

    const decoded = this.decodeToken();

    return decoded?.user_role || null;

  }
 
  static getRegistrationNo() {
  
    const decoded = this.decodeToken();
    return decoded?.ref_no ||  null;
   
  }
 
 
  static getUserId() {

    const decoded = this.decodeToken();

    return decoded?.user_id || null;

  }
 
  static removeToken() {

    localStorage.removeItem("token");

  }

}
 
export default TokenService;
 