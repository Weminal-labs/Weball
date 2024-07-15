// import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Layout from "./pages/Layout";
import { LoginPage } from "./pages/Login";
import { CallbackPage } from "./pages/Callback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<Layout/>}>
          <Route path="/" element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />

      </Routes>
    </Router>
  );
}

export default App;
