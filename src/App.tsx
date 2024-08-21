// import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./pages/layout/Layout";
import CreateRoom from "./pages/main/CreateRoom";
import Leaderboard from "./pages/main/Leaderboard";
import { LoginPage } from "./pages/main/Login/Login";
import { CallbackPage } from "./pages/layout/Callback";
import AuthLayout from "./pages/layout/AuthLayout";
import RequireAuth from "./components/layout/RequireAuth";
import Home from "./pages/main/home/Home";
import PlayGame from "./pages/main/PlayGame/PlayGamePage";
import UpdateAccount from "./components/layout/UpdateAccout/UpdateAccount";
import Faucet from "./pages/main/Faucet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/playGame" element={<PlayGame />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/faucet" element={<Faucet />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="update" element={<UpdateAccount />} />

        </Route>
        <Route path="callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;
