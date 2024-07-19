// import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Layout from "./pages/Layout";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Leaderboard from "./pages/Leaderboard";
import AddBets from "./pages/AddBets";
import { LoginPage } from "./pages/Login";
import { CallbackPage } from "./pages/Callback";
import RequireAuth from "./components/RequireAuth";
import AuthLayout from "./pages/AuthLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="rooms" element={<Rooms />} />
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
