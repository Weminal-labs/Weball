// import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./pages/layout/Layout";
import CreateRoom from "./pages/main/CreateRoom";
import Leaderboard from "./pages/main/Leaderboard";
import AddBets from "./pages/main/AddBets";
import { LoginPage } from "./pages/main/Login";
import { CallbackPage } from "./pages/main/Callback";
import AuthLayout from "./pages/layout/AuthLayout";
import RequireAuth from "./components/layout/RequireAuth";
import Home from "./pages/main/Home";
import JoinRoom from "./pages/main/JoinRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/add-bets" element={<AddBets />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;
