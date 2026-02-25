import { createContext, useContext, useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

interface User {
  userId: number;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoadingAuth: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { execute } = useFetch('GET', '/auth/check');

  useEffect(() => {
    const verifySession = async () => {
      const res = await execute();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    };

    verifySession();
  }, [execute]);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};