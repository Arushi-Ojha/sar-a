import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import {motion} from "framer-motion";
import { useState,useEffect } from "react";
import Globe from "./pages/Globe"
function App() {
  return (
    <div>
    <Router >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/globe" element={<Globe />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
