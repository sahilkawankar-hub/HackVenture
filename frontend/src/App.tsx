import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import CivicEye from "./pages/CivicEye";
import LostFound from "./pages/LostFound";
import Marketplace from "./pages/Marketplace";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/civic-eye" element={<CivicEye />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
