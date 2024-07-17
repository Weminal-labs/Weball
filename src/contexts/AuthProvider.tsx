import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../type/type";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { jwtDecode } from "jwt-decode";

// Define an interface for the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}
export interface AuthContextType {
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
  getAuth: () => Promise<void>
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const flow = useAptimusFlow();

  const [auth, setAuth] = useState<User | null>(null);
  const getAuth = async () => {
    const session = await flow.getSession();
    if (session && session.jwt) {
      console.log("kkkkk")
      const user: User = jwtDecode(session.jwt);
      setAuth(user);
    }
  };


  // useEffect(() => {
  //   console.log("Auth State Updated:", auth);
  // }, [auth]);
  return (
    <AuthContext.Provider value={{ auth, setAuth ,getAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
