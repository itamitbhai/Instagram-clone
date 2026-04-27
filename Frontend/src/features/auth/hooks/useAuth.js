import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)

    const { user, setUser, loading, setLoading } = context

    // 🔥 AUTO LOAD USER (IMPORTANT)
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await getMe()
                setUser(res.user)
            } catch (err) {
                console.log("User not logged in")
                setUser(null)
            }
        }

        if (!user) {
            loadUser()
        }
    }, [])

    // LOGIN
    const handleLogin = async (username, password) => {
        setLoading(true)

        const response = await login(username, password)
        setUser(response.user)

        setLoading(false)
    }

    // REGISTER
    const handleRegister = async (username, email, password) => {
        setLoading(true)

        const response = await register(username, email, password)
        setUser(response.user)

        setLoading(false)
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister
    }
}