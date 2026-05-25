import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";

import {
  login,
  register,
  getMe,
  logout,
} from "../services/auth.api";

export const useAuth = () => {

  const {
    user,
    setUser,
    loading,
    setLoading,
    checkedAuth,
    setCheckedAuth,
  } = useContext(AuthContext);

  // ================= AUTO LOGIN =================
  useEffect(() => {

    const loadUser = async () => {

      try {

        setLoading(true);

        const token = localStorage.getItem("token");

        // ❌ NO TOKEN
        if (!token) {
          setUser(null);
          return;
        }

        // ✅ GET USER
        const res = await getMe();

        // ✅ SAVE USER
        setUser(res.user);

      } catch (err) {

        console.log("getMe error:", err);

        setUser(null);

        localStorage.removeItem("token");

      } finally {

        setLoading(false);

        setCheckedAuth(true);
      }
    };

    loadUser();

  }, []);

  // ================= LOGIN =================
  const handleLogin = async (email, password) => {

    try {

      setLoading(true);

      const res = await login(email, password);

      console.log("LOGIN RESPONSE:", res);

      //TOKEN SAVE
      localStorage.setItem(
        "token",
        res.token
      );

      // USER SAVE
      setUser(res.user);

      return true;

    } catch (err) {

      console.log("Login error:", err);

      return false;

    } finally {

      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (
    username,
    email,
    password
  ) => {

    try {

      setLoading(true);

      const res = await register(
        username,
        email,
        password
      );

      // ✅ TOKEN SAVE
      localStorage.setItem(
        "token",
        res.token
      );

      // ✅ USER SAVE
      setUser(res.user);

      return true;

    } catch (err) {

      console.log("Register error:", err);

      return false;

    } finally {

      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {

    localStorage.removeItem("token");

    logout();

    setUser(null);
  };

  return {
    user,
    loading,
    checkedAuth,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};