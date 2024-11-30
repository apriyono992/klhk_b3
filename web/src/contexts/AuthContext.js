import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getFetcher } from "../services/api";
import { LOGIN_PATH } from "../services/routes";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { // Tambahkan 'children' dalam argumen
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchUserInfo = async (userId) => {
    try {
      const userInfo = await getFetcher(`/api/users/find/${userId}`);
      setUser(userInfo);
      setRoles(userInfo.roles.map((role) => role.role.name));
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const jwtToken = Cookies.get("accessToken"); // Tambahkan deklarasi jwtToken
    if (!jwtToken) {
      setUser(null);
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) throw new Error("Token expired");
      fetchUserInfo(payload.userId);
    } catch (error) {
      console.error("Invalid token:", error);
      Cookies.remove("accessToken");
      setUser(null);
      setRoles([]);
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg"/></div>;

  if (!user) return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;

  return (
    <AuthContext.Provider value={{ user, roles }}>
           <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
