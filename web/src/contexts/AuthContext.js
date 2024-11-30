import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getFetcher } from "../services/api";
import { LOGIN_PATH, DASHBOARD_PATH, PELAPORAN_DASHBOARD_PATH, CMS_NEWS_PATH, NOTIFICATION_DASHBOARD_PATH, REGISTRATION_DASHBOARD_PATH, RECOMENDATION_DASHBOARD_PATH } from "../services/routes";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import RolesAccess from "../enums/roles";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => { // Tambahkan 'children' dalam argumen
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(true); // State untuk mengontrol redirect
  const rolePaths = {
    [RolesAccess.PIC_PELAPORAN]: PELAPORAN_DASHBOARD_PATH,
    [RolesAccess.PENGELOLA]: PELAPORAN_DASHBOARD_PATH,
    [RolesAccess.PIC_CMS]: CMS_NEWS_PATH,
    [RolesAccess.PIC_NOTIFIKASI]: NOTIFICATION_DASHBOARD_PATH,
    [RolesAccess.PIC_REGISTRASI]: REGISTRATION_DASHBOARD_PATH,
    [RolesAccess.PIC_REKOMENDASI]: RECOMENDATION_DASHBOARD_PATH,
    ...Object.fromEntries(
      [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.KAB_SUBDIT_REGISTRASI, RolesAccess.KAB_SUBDIT_REKOMENDASI]
        .map(role => [role, DASHBOARD_PATH])
    )
  };

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
 // Redirect after login
  if (redirectAfterLogin) {
    const userRole = roles.find((role) => rolePaths[role]);
    if (userRole) {
      setRedirectAfterLogin(false); // Prevent future redirects
      return <Navigate to={rolePaths[userRole]} replace />;
    }
  }

  return (
    <AuthContext.Provider value={{ user, roles }}>
      <Outlet />
    </AuthContext.Provider>
  );
};


// Component for handling role-based redirects
const RedirectHandler = ({ roles }) => {
  const location = useLocation();
  const rolePaths = {
    [RolesAccess.PIC_PELAPORAN]: PELAPORAN_DASHBOARD_PATH,
    [RolesAccess.PENGELOLA]: PELAPORAN_DASHBOARD_PATH,
    [RolesAccess.PIC_CMS]: CMS_NEWS_PATH,
    [RolesAccess.PIC_NOTIFIKASI]: NOTIFICATION_DASHBOARD_PATH,
    [RolesAccess.PIC_REGISTRASI]: REGISTRATION_DASHBOARD_PATH,
    [RolesAccess.PIC_REKOMENDASI]: RECOMENDATION_DASHBOARD_PATH,
    ...Object.fromEntries(
      [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.KAB_SUBDIT_REGISTRASI, RolesAccess.KAB_SUBDIT_REKOMENDASI]
        .map(role => [role, DASHBOARD_PATH])
    )
  };

  const userRole = roles.find((role) => rolePaths[role]);
  if (userRole && location.pathname !== rolePaths[userRole]) {
    return <Navigate to={rolePaths[userRole]} replace />;
  }

  return null; // No redirect needed
};

export const useAuth = () => useContext(AuthContext);
