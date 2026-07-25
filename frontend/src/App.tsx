import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { ProtectedRoute, AdminRoute } from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import CivicEye from "./pages/CivicEye";
import CommunityPage from "./pages/Community";
import LostFound from "./pages/LostFound";
import Marketplace from "./pages/Marketplace";
import Jobs from "./pages/Jobs";
import SOS from "./pages/SOS";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes — requires Supabase / Demo session */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/civic-eye" element={<CivicEye />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
