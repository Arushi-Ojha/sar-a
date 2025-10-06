import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import {motion} from "framer-motion";
import { useState,useEffect } from "react";
import Globe from "./pages/Globe"
import Create from "./pages/Create"
function App() {
  return (
    <div>
    <Router >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/globe" element={<Globe />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
