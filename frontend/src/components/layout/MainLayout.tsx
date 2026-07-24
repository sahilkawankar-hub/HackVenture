import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Main layout wrapper with fixed sidebar and scrollable main area.
 * Sidebar is 256px wide (w-64); main area gets ml-64 offset.
 * Uses the light Stitch design shell (bg-[#f8f9ff]).
 */
function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Scrollable content area — offset by sidebar width */}
      <div className="ml-64 flex flex-col flex-1 min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
