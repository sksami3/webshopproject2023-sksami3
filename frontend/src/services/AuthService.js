import { USERSSERVICE } from "../constants";
import jwt from "jsonwebtoken";

const AuthService = {
  setToken: (token) => {
    console.log('in set token');
    console.log(token);
    localStorage.setItem("jwtToken", token);
  },

  getToken: () => {
    return localStorage.getItem("jwtToken");
  },

  removeToken: () => {
    localStorage.removeItem("jwtToken");
  },

  getUserFromToken: () => {
    const token = AuthService.getToken();
    if (token) {
      const decodedToken = jwt.decode(token);
      if (!decodedToken) return null;
      else
        return {
          userId: decodedToken.id || null,
          username: decodedToken.username || null,
        };
    }
    return null;
  },

  login: async (username, password) => {
    try {
      const response = await fetch(USERSSERVICE + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      // .then(response => response.json())
      // .then(data => {
      //     jwtToken = data.jwt;
      //     // Now you can use the token as needed (e.g., store it in local storage or a state variable)
      // })
      // .catch(error => console.error('Error:', error));

      if (response.ok) {
        const data = await response.json();
        AuthService.setToken(data.jwt);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "An error occurred during login." };
    }
  },

  // Add other methods as needed
};

export default AuthService;
