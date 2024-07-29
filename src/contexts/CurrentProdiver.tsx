import { createContext, ReactNode, useState } from "react";
import { RoomType, User } from "../type/type";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { jwtDecode } from "jwt-decode";

// Define an interface for the CurrentProvider props
interface CurrentProviderProps {
  children: ReactNode;
}
export interface CurrentContextType {
  Current: RoomType | null;
  setCurrent: React.Dispatch<React.SetStateAction<RoomType | null>>;
}
const CurrentContext = createContext<CurrentContextType | null>(null);

export const CurrentProvider: React.FC<CurrentProviderProps> = ({ children }) => {

  const [Current, setCurrent] = useState<RoomType | null>(null);


  return (
    <CurrentContext.Provider value={{ Current, setCurrent }}>
      {children}
    </CurrentContext.Provider>
  );
};

export default CurrentContext;
