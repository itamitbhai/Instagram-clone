import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  const [checkedAuth, setCheckedAuth] = useState(false); 

  // ================= AUTO LOGIN =================
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const res = await getMe(); 
        setUser(res.user);

      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
        setCheckedAuth(true); 
      }
    };

    loadUser();
  }, []);

  // ================= LOGIN =================
  const handleLogin = async (username, password) => {
    try {
      setLoading(true);

      const response = await login(username, password);
      setUser(response.user);

    } catch (err) {
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (username, email, password) => {
    try {
      setLoading(true);

      const response = await register(username, email, password);
      setUser(response.user);

    } catch (err) {
      console.log("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    checkedAuth, 
    handleLogin,
    handleRegister,
  };
};