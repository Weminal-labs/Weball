import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAptimusFlow, useKeylessLogin } from 'aptimus-sdk-test/react';
import useAuth from '../../hooks/useAuth';
import { User } from '../../type/type';
import { jwtDecode } from 'jwt-decode';

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();
  const flow = useAptimusFlow();
  const { address } = useKeylessLogin();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      let jwt = localStorage.getItem('jwt');

      if (!jwt) {
        const session = await flow.getSession();
        jwt = session?.jwt ?? "";
        if (jwt) {
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('address', address??"");

        }
      }

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
      setLoading(false);
    }

    // console.log("Address:", address);
  }, [auth, setAuth, flow, address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth ? <Outlet /> : <Navigate to="auth/login" state={{ from: location }} replace />;
};

export default RequireAuth;
