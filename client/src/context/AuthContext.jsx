// import { createContext, useState, useEffect } from 'react';
// import api from '../api/axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         checkUserLoggedIn();
//     }, []);

//     const checkUserLoggedIn = async () => {
//         try {
//             const { data } = await api.get('/auth/me');
//             setUser(data);
//         } catch {
//             setUser(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email, password) => {
//         const { data } = await api.post('/auth/login', { email, password });
//         localStorage.setItem('token', data.token);
//         setUser(data);
//         return data;
//     };

//     const register = async (name, email, password) => {
//         const { data } = await api.post('/auth/register', { name, email, password });
//         return data;
//     };

//     const verifyOtp = async (name, email, password, otp) => {
//         const { data } = await api.post('/auth/verify-otp', { name, email, password, otp });
//         localStorage.setItem('token', data.token);
//         setUser(data);
//         return data;
//     };

//     const resendOtp = async (email) => {
//         const { data } = await api.post('/auth/resend-otp', { email });
//         return data;
//     };

//     const updateProfile = async (profileData) => {
//         const { data } = await api.put('/auth/profile', profileData);
//         setUser(data);
//         return data;
//     };

//     const logout = async () => {
//         await api.post('/auth/logout');
//         localStorage.removeItem('token');
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{
//             user,
//             login,
//             register,
//             verifyOtp,
//             resendOtp,
//             logout,
//             updateProfile,
//             loading
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthContext;




import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check auth status on mount - ONLY if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Don't hit /auth/me if no token - prevents unnecessary CORS errors
        if (!token) {
            setLoading(false);
            setUser(null);
            setIsAuthenticated(false);
            return;
        }

        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = useCallback(async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
            setIsAuthenticated(true);
        } catch (err) {
            // Only clear token on actual auth failure, not network errors
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token');
            }
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data;
    }, []);

    const verifyOtp = useCallback(async (name, email, password, otp) => {
        const { data } = await api.post('/auth/verify-otp', { name, email, password, otp });
        localStorage.setItem('token', data.token);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    }, []);

    const resendOtp = useCallback(async (email) => {
        const { data } = await api.post('/auth/resend-otp', { email });
        return data;
    }, []);

    const updateProfile = useCallback(async (profileData) => {
        const { data } = await api.put('/auth/profile', profileData);
        setUser(data);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.warn('Logout API error:', err.message);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        isAuthenticated,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
        loading
    }), [user, isAuthenticated, loading, login, register, verifyOtp, resendOtp, logout, updateProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;