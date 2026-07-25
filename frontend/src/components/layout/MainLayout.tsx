import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
};

const pageTransition = { duration: 0.2 };

function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Scrollable content area — offset by sidebar width */}
      <div className="ml-[240px] flex flex-col flex-1 min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
