import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAptimusFlow, useKeylessLogin } from 'aptimus-sdk-test/react';
import useAuth from '../../hooks/useAuth';
import { PlayerInfo, User } from '../../type/type';
import { jwtDecode} from 'jwt-decode';
import { Aptos, AptosConfig, InputViewFunctionData, Network } from '@aptos-labs/ts-sdk';
import { MODULE_ADDRESS } from '../../utils/Var';
import UpdateAccount from './UpdateAccount';

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();
  const flow = useAptimusFlow();
  const { address } = useKeylessLogin();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [checkUpdate, setCheckUpdate] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {

      const currentTime = Math.floor(Date.now() / 1000);
      let jwt = localStorage.getItem('jwt');

      if (!jwt) {
        const session = await flow.getSession();
        jwt = session?.jwt ?? "";
        if (jwt) {
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('address', address ?? "");
        }
      }

      UpdateAccount(localStorage.getItem("address")??"");
      if (jwt) {
        const user: User = jwtDecode(jwt);
        if (user.exp && user.exp > currentTime) {
          setAuth(user);
          setLoading(false);
          return;
        } else {
          localStorage.clear();
        }
      }


      setLoading(false);
    };

    if (!auth) {
      checkAuth();

    } else {
      UpdateAccount(address);

      setLoading(false);
    }

  }, []);

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

        setAuth((prevAuth) => ({
          ...(prevAuth as User),
          picture: info.user_image,
        }));

        setCheckUpdate(true);
      } catch (error) {
        console.log(error);
        navigate("/auth/update");
        setCheckUpdate(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth ? <Outlet /> : <Navigate to="auth/login" state={{ from: location }} replace />;
};

export default RequireAuth;
