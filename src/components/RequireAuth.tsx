import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { User } from '../type/type';
import { useAptimusFlow } from 'aptimus-sdk-test/react';

const RequireAuth = () => {
  const { auth,setAuth } = useAuth();
  const flow = useAptimusFlow();

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
    console.log("Auth:", auth);
  }, [auth, setAuth]);


  if(loading){
    return <div>loading...</div>
  }
 else{
  return auth?<Outlet />:<Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
