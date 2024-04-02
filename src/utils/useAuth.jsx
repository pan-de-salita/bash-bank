import { createContext } from "react";
import useLocalStorage from "./useLocalStorage";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  async function login(date) {
    setUser(date);
    navigate('/root');
  }

  const value = useMemo(() => ({
    user,
    login,
    logout,
  }), [user])

  return <AuthContext.Provider value={value}>{children}</ AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext);
}
