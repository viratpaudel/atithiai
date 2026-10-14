import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  User,
  Bell,
  Sparkles,
  Camera,
} from "lucide-react";
import HomeTab from "./HomeTab";
import DiscoverTab from "./DiscoverTab";
import AITab from "./AITab";
import ServicesTab from "./ServicesTab";
import ProfileTab from "./ProfileTab";
import LensTab from "./LensTab";
import NavIcon from "./NavIcon";

import { useApp } from "../../context/AppContext";

export default function GuestApp() {
  const { addRequest, requests } = useApp();
  const [activeTab, setActiveTab] = useState("services");
  const [aiPrefill, setAiPrefill] = useState(null);

  const tabVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex justify-center min-h-screen bg-hero text-white p-0 md:p-8">
      <div className="w-full max-w-[430px] bg-surface md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] md:h-[850px] border-[8px] border-brand-950">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <HomeTab setActiveTab={setActiveTab} />
              </motion.div>
            )}
            {activeTab === "discover" && (
              <motion.div
                key="discover"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <DiscoverTab onRequest={addRequest} />
              </motion.div>
            )}
            {activeTab === "ai" && (
              <motion.div
                key="ai"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <AITab onRequest={addRequest} initialDraft={aiPrefill} />
              </motion.div>
            )}
            {activeTab === "lens" && (
              <motion.div
                key="lens"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <LensTab
                  onAskAtithi={(question) => {
                    setAiPrefill(question);
                    setActiveTab("ai");
                  }}
                />
              </motion.div>
            )}
            {activeTab === "services" && (
              <motion.div
                key="services"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <ServicesTab
                  requests={requests}
                  onRequest={addRequest}
                  setActiveTab={setActiveTab}
                />
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <ProfileTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating pill bottom navigation */}
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <div className="glass rounded-full shadow-navpill px-3 py-2.5 flex justify-between items-center">
            <NavIcon
              icon={Home}
              label="Home"
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
            />
            <NavIcon
              icon={Compass}
              label="Discover"
              active={activeTab === "discover"}
              onClick={() => setActiveTab("discover")}
            />

            <div className="relative -top-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.06 }}
                onClick={() => setActiveTab("ai")}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-primary-btn text-white shadow-glow"
              >
                <Sparkles size={24} />
              </motion.button>
            </div>

            <NavIcon
              icon={Bell}
              label="Services"
              active={activeTab === "services"}
              onClick={() => setActiveTab("services")}
            />
            <NavIcon
              icon={Camera}
              label="Lens"
              active={activeTab === "lens"}
              onClick={() => setActiveTab("lens")}
            />
            <NavIcon
              icon={User}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}