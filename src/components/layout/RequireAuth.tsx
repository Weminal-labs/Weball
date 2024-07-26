import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAptimusFlow, useKeylessLogin } from 'aptimus-sdk-test/react';
import useAuth from '../../hooks/useAuth';
import { User } from '../../type/type';

const RequireAuth = () => {
  const { auth,setAuth } = useAuth();
  const flow = useAptimusFlow();
  
  const { address}=useKeylessLogin();
  const location = useLocation();
  const [loading,setLoading ] =useState(true)
  useEffect(() => {
    if (!auth) {
      const getAuth = async () => {
        const session = await flow.getSession();
        if (session && session.jwt) {
          const user: User = jwtDecode(session.jwt ?? "");
          setAuth(user);
        }
        setLoading(false);
      };

      getAuth();
    } else {
      setLoading(false);
    }
    console.log("Address:", address );
  }, [auth, setAuth]);


  if(loading){
    return <div>loading...</div>
  }
 else{
  return auth?<Outlet />:<Navigate to="auth/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
