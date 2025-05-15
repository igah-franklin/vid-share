import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";
import { BASE_URL } from "../baseurl";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set default headers for all requests
        axios.defaults.headers.common["x-auth-token"] = token;

        const res = await axios.get(`${BASE_URL}/api/auth`);
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
        setError("Authentication failed. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/users`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["x-auth-token"] = res.data.token;

      const userRes = await axios.get(`${BASE_URL}/api/auth`);
      setUser(userRes.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["x-auth-token"] = res.data.token;

      const userRes = await axios.get("/api/auth");
      setUser(userRes.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Invalid credentials";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
