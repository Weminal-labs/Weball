import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { PlayerInfo, User } from "../../type/type";
import { jwtDecode } from "jwt-decode";
import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const RequireAuth = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [checkUpdate, setCheckUpdate] = useState(true);
  const navigate = useNavigate();
  const { account,connected, isLoading, } = useWallet();
  useEffect(() => {
    // console.log(isLoading)
    if(connected){
      const address = localStorage.getItem("address") ?? "";
 
  
        UpdateAccount(address);
      
  
    }


  }, [connected]);
  useEffect(()=>{
    console.log(isLoading)
  },[isLoading])
  const UpdateAccount = async (address: string | undefined) => {
    console.log("Address:", address);

    if (address) {
      try {
        const aptosConfig = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(aptosConfig);
        const payload: InputViewFunctionData = {
          function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
          functionArguments: [address],
        };
        const response = await aptos.view({ payload });
        // @ts-ignore

        const info: PlayerInfo = response[0];
        console.log(info);

        setCheckUpdate(true);
      } catch (error) {
        console.log(error);
        navigate("/create-account");
        setCheckUpdate(false);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return connected ? (
    <Outlet />
  ) : (
    <Navigate to="auth/login" state={{ from: location }} replace />

  );
};

export default RequireAuth;
