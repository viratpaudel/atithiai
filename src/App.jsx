import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, CloudRain, Clock, MapPin, Utensils, Sparkles, MessageSquare, 
  Home, LayoutDashboard, User, Bell, ChevronRight, Check, Compass, 
  Coffee, ShieldCheck, Thermometer, Wind, Droplets, CalendarDays,
  Search, BedDouble, Bath, Car, Settings, CreditCard, ChevronLeft,
  Send
} from 'lucide-react';

// --- MOCK DATA ---
const GUEST = {
  name: "Virat",
  lastName: "Sharma",
  room: "402 (Luxury Suite)",
  preferences: {
    diet: "Vegetarian",
    interests: ["Culture", "Wellness", "Quiet Dining"],
    vibe: "Relaxing"
  }
};

const SUNNY_ITINERARY = [
  { id: 1, time: "09:00 AM", title: "In-Room Breakfast", desc: "Vegetarian Continental, Green Tea", icon: Coffee, type: "dining", status: "completed" },
  { id: 2, time: "11:00 AM", title: "Private City Tour", desc: "Heritage sites and local markets", icon: Compass, type: "activity", status: "current" },
  { id: 3, time: "02:00 PM", title: "Light Lunch at The Courtyard", desc: "Reserved table by the fountain", icon: Utensils, type: "dining", status: "upcoming" },
  { id: 4, time: "04:00 PM", title: "Botanical Garden Walk", desc: "Outdoor guided nature walk", icon: MapPin, type: "activity", status: "upcoming", isVulnerableToWeather: true },
  { id: 5, time: "07:30 PM", title: "Dinner at Saffron", desc: "Chef's special vegetarian tasting menu", icon: Utensils, type: "dining", status: "upcoming" }
];

const AI_ALTERNATIVES = [
  { id: 'alt_1', title: "National Art Museum", desc: "Private indoor guided tour (15 mins away).", icon: MapPin, match: "98% match with 'Culture'" },
  { id: 'alt_2', title: "Signature Ayurvedic Spa", desc: "60-min deep tissue massage in the wellness center.", icon: Sparkles, match: "95% match with 'Wellness'" }
];

const EXPERIENCES = [
  { id: 1, title: "Ayurvedic Rejuvenation", category: "Wellness", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Chef's Tasting Menu", category: "Dining", img: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Heritage Sunset Walk", category: "Culture", img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop" }
];

// --- MAIN APP ---
export default function AtithiAI() {
  const [appMode, setAppMode] = useState('guest'); 
  const [weather, setWeather] = useState('sunny'); 
  const [itinerary, setItinerary] = useState(SUNNY_ITINERARY);
  const [showAIIntervention, setShowAIIntervention] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [activeGuestTab, setActiveGuestTab] = useState('home');

  useEffect(() => {
    if (weather === 'rainy' && itinerary.some(item => item.isVulnerableToWeather)) {
      setTimeout(() => setShowAIIntervention(true), 600);
    } else {
      setShowAIIntervention(false);
    }
  }, [weather, itinerary]);

  const acceptAlternative = (alt) => {
    setIsResolving(true);
    setTimeout(() => {
      setItinerary(prev => prev.map(item => 
        item.time === "04:00 PM" 
          ? { ...item, title: alt.title, desc: alt.desc, isVulnerableToWeather: false, icon: alt.icon, aiAdjusted: true }
          : item
      ));
      setShowAIIntervention(false);
      setIsResolving(false);
    }, 1200);
  };

  const keepOriginal = () => {
    setShowAIIntervention(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1C1C1C] font-sans selection:bg-[#BCA37F] selection:text-white">
      {appMode === 'guest' ? (
        <GuestApp 
          weather={weather} 
          itinerary={itinerary} 
          showAIIntervention={showAIIntervention}
          isResolving={isResolving}
          acceptAlternative={acceptAlternative}
          keepOriginal={keepOriginal}
          activeTab={activeGuestTab}
          setActiveTab={setActiveGuestTab}
        />
      ) : (
        <AdminDashboard 
          weather={weather} 
          itinerary={itinerary} 
          showAIIntervention={showAIIntervention}
        />
      )}

      {/* Demo Controller */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E5E0D8]">
        <p className="text-xs font-semibold tracking-wider text-[#8C857B] uppercase mb-1">Demo Controls</p>
        
        <div className="flex bg-[#F0ECE4] rounded-lg p-1">
          <button 
            onClick={() => setAppMode('guest')}
            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-all ${appMode === 'guest' ? 'bg-white shadow-sm text-[#1C1C1C]' : 'text-[#8C857B] hover:text-[#1C1C1C]'}`}
          >
            Guest App
          </button>
          <button 
            onClick={() => setAppMode('admin')}
            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-all ${appMode === 'admin' ? 'bg-white shadow-sm text-[#1C1C1C]' : 'text-[#8C857B] hover:text-[#1C1C1C]'}`}
          >
            Admin
          </button>
        </div>

        <button 
          onClick={() => {
            if (weather === 'sunny') setWeather('rainy');
            else {
              setWeather('sunny');
              setItinerary(SUNNY_ITINERARY);
            }
          }}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
            weather === 'sunny' 
              ? 'bg-[#1C1C1C] text-white hover:bg-[#2A2A2A]' 
              : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
          }`}
        >
          {weather === 'sunny' ? <CloudRain size={16} /> : <Sun size={16} />}
          {weather === 'sunny' ? 'Trigger Rain (4:00 PM)' : 'Reset Weather'}
        </button>
      </div>
    </div>
  );
}

// --- GUEST APP CONTAINER ---
function GuestApp(props) {
  const { activeTab, setActiveTab } = props;

  const tabVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#EAE6DF] p-0 md:p-8">
      <div className="w-full max-w-[430px] bg-[#F7F5F2] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] md:h-[850px] border-[8px] border-[#1C1C1C]">
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div key="home" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <HomeTab {...props} />
              </motion.div>
            )}
            {activeTab === 'discover' && (
              <motion.div key="discover" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                <DiscoverTab />
              </motion.div>
            )}
            {activeTab === 'ai' && (
              <motion.div key="ai" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                <AITab />
              </motion.div>
            )}
            {activeTab === 'services' && (
              <motion.div key="services" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                <ServicesTab />
              </motion.div>
            )}
            {activeTab === 'profile' && (
              <motion.div key="profile" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="h-full">
                <ProfileTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E5E0D8] px-6 py-4 flex justify-between items-center z-40 pb-safe">
          <NavIcon icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavIcon icon={Compass} label="Discover" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
          
          <div className="relative -top-6">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${activeTab === 'ai' ? 'bg-[#BCA37F] text-white shadow-[#BCA37F]/30' : 'bg-[#1C1C1C] text-[#BCA37F] shadow-[#1C1C1C]/20'}`}
            >
              <Sparkles size={24} />
            </button>
          </div>
          
          <NavIcon icon={Bell} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <NavIcon icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </div>
    </div>
  );
}

// --- TAB COMPONENTS ---

function HomeTab({ weather, itinerary, showAIIntervention, isResolving, acceptAlternative, keepOriginal }) {
  return (
    <>
      <div className="px-6 pt-12 pb-6 bg-[#1C1C1C] text-white rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-serif text-3xl mb-1">Good morning,</h1>
            <h1 className="font-serif text-3xl text-[#BCA37F] italic">{GUEST.name}.</h1>
          </div>
          <div className="w-12 h-12 rounded-full border border-[#BCA37F]/30 overflow-hidden bg-[#2A2A2A] flex items-center justify-center">
            <User size={24} className="text-[#BCA37F]" />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
          {weather === 'sunny' ? (
            <Sun size={32} className="text-amber-400" />
          ) : (
            <CloudRain size={32} className="text-blue-300" />
          )}
          <div>
            <p className="text-sm text-white/70">Right now in Dehradun</p>
            <p className="text-lg font-medium">
              {weather === 'sunny' ? '24°C, Clear Skies' : '19°C, Heavy Rain'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        <AnimatePresence mode="popLayout">
          {!showAIIntervention && !isResolving && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E0D8]"
            >
              <div className="flex gap-3">
                <Sparkles size={20} className="text-[#BCA37F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#1C1C1C] leading-relaxed">
                    {weather === 'sunny' 
                      ? "We've planned a relaxed morning followed by your city tour. Your plans are looking perfect for today's weather." 
                      : "I've updated your schedule for the rain. Enjoy a cozy afternoon indoors."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAIIntervention && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <CloudRain size={18} />
                  <span className="text-sm font-medium tracking-wide uppercase">Weather Alert</span>
                </div>
                <p className="text-white text-lg font-serif mb-2 leading-snug">
                  Rain is expected around 4:00 PM.
                </p>
                <p className="text-white/70 text-sm">
                  Your outdoor Botanical Garden Walk will be affected. I've found suitable indoor alternatives based on your preference for Cultural and Wellness activities.
                </p>
              </div>
              
              <div className="p-5 bg-[#252525] space-y-3">
                {isResolving ? (
                  <div className="py-8 flex flex-col items-center justify-center text-white/70">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                      <Sparkles size={24} className="text-[#BCA37F]" />
                    </motion.div>
                    <p className="mt-3 text-sm">Updating your itinerary...</p>
                  </div>
                ) : (
                  <>
                    {AI_ALTERNATIVES.map((alt) => (
                      <button 
                        key={alt.id}
                        onClick={() => acceptAlternative(alt)}
                        className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors group flex items-start gap-4"
                      >
                        <div className="bg-[#1C1C1C] p-2 rounded-lg group-hover:bg-[#BCA37F] transition-colors shrink-0">
                          <alt.icon size={20} className="text-[#BCA37F] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">{alt.title}</h4>
                          <p className="text-white/50 text-xs mb-2">{alt.desc}</p>
                          <span className="text-[10px] uppercase tracking-wider text-[#BCA37F] font-semibold bg-[#BCA37F]/10 px-2 py-1 rounded">
                            {alt.match}
                          </span>
                        </div>
                      </button>
                    ))}
                    <button onClick={keepOriginal} className="w-full text-center text-white/50 text-sm py-2 mt-2 hover:text-white transition-colors">
                      Keep original plan
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-serif text-2xl text-[#1C1C1C]">Today's Stay</h2>
            <span className="text-sm font-medium text-[#8C857B]">Oct 1, 2026</span>
          </div>
          
          <div className="relative border-l-2 border-[#E5E0D8] ml-4 space-y-8 pb-4">
            <AnimatePresence>
              {itinerary.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative pl-6"
                >
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                    item.status === 'completed' ? 'bg-[#8C857B] border-[#8C857B]' : 
                    item.status === 'current' ? 'bg-[#1C1C1C] border-[#1C1C1C]' : 
                    item.isVulnerableToWeather && weather === 'rainy' ? 'bg-white border-red-500 animate-pulse' :
                    'bg-white border-[#E5E0D8]'
                  }`} />
                  
                  <div className={`
                    rounded-2xl p-4 transition-all
                    ${item.status === 'current' ? 'bg-white shadow-md border border-[#E5E0D8]' : ''}
                    ${item.isVulnerableToWeather && weather === 'rainy' ? 'bg-red-50 border border-red-100' : ''}
                  `}>
                    <p className={`text-xs font-semibold tracking-wider mb-1 ${
                      item.status === 'completed' ? 'text-[#A39C93]' : 
                      item.status === 'current' ? 'text-[#BCA37F]' : 
                      item.isVulnerableToWeather && weather === 'rainy' ? 'text-red-500' : 'text-[#8C857B]'
                    }`}>
                      {item.time}
                    </p>
                    <h3 className={`font-medium text-lg mb-1 ${item.status === 'completed' ? 'text-[#8C857B] line-through' : 'text-[#1C1C1C]'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6B655C] leading-snug">{item.desc}</p>
                    
                    {item.aiAdjusted && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#BCA37F] bg-[#BCA37F]/10 px-2 py-1 rounded-md">
                        <Sparkles size={12} /> Adjusted by AI
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E0D8]">
          <h2 className="font-serif text-2xl text-[#1C1C1C] mb-4">Tonight's Dining</h2>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E0D8]">
            <div className="w-full h-32 rounded-xl bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mb-4" />
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg">Saffron Heritage Room</h3>
              <span className="bg-[#1C1C1C] text-white text-xs px-2 py-1 rounded">Booked</span>
            </div>
            <p className="text-sm text-[#6B655C] mb-4 border-l-2 border-[#BCA37F] pl-3 italic">
              "Recommended because you prefer quiet, vegetarian fine-dining. Chef Anand has prepared a custom tasting menu."
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#F0ECE4] text-[#1C1C1C] text-sm py-2 rounded-lg font-medium hover:bg-[#E5E0D8] transition-colors">
                View Custom Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DiscoverTab() {
  return (
    <div className="pt-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#1C1C1C]">Discover</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#E5E0D8] flex items-center justify-center">
          <Search size={18} className="text-[#1C1C1C]" />
        </button>
      </div>

      <div className="bg-[#1C1C1C] rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#BCA37F] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        <Sparkles size={24} className="text-[#BCA37F] mb-3 relative z-10" />
        <h2 className="font-serif text-xl mb-2 relative z-10">AI Recommendations</h2>
        <p className="text-white/70 text-sm mb-4 relative z-10">
          Based on your preference for "Culture & Wellness", we've curated these specific experiences for you.
        </p>
      </div>

      <div className="space-y-6">
        {EXPERIENCES.map((exp) => (
          <div key={exp.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E0D8] group">
            <div 
              className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: `url(${exp.img})` }}
            />
            <div className="p-5 relative bg-white">
              <span className="absolute -top-3 left-5 bg-[#BCA37F] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {exp.category}
              </span>
              <h3 className="font-serif text-xl text-[#1C1C1C] mb-1">{exp.title}</h3>
              <p className="text-sm text-[#8C857B] mb-4">A personalized experience tailored to your stay preferences.</p>
              <button className="text-[#1C1C1C] font-medium text-sm flex items-center gap-1 hover:text-[#BCA37F] transition-colors">
                Explore Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AITab() {
  return (
    <div className="h-full flex flex-col bg-[#F7F5F2]">
      <div className="pt-12 px-6 pb-4 bg-white border-b border-[#E5E0D8] shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center">
            <Sparkles size={20} className="text-[#BCA37F]" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-[#1C1C1C]">Atithi Concierge</h1>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col justify-end pb-8">
        <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-[#E5E0D8] max-w-[85%]">
          <p className="text-sm text-[#1C1C1C] leading-relaxed">
            Good afternoon, {GUEST.name}. I've noticed you have a free evening tomorrow. Would you like me to book the Sunset Ayurvedic Spa session? It aligns perfectly with your wellness preferences.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="bg-white text-[#1C1C1C] text-xs font-medium px-4 py-2 rounded-full border border-[#E5E0D8] shadow-sm">Yes, book the spa.</button>
          <button className="bg-white text-[#1C1C1C] text-xs font-medium px-4 py-2 rounded-full border border-[#E5E0D8] shadow-sm">Show dining options instead.</button>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-t border-[#E5E0D8]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask for recommendations or services..." 
            className="w-full bg-[#F0ECE4] border-none rounded-full py-3.5 pl-4 pr-12 text-sm text-[#1C1C1C] placeholder:text-[#8C857B] focus:ring-2 focus:ring-[#BCA37F] outline-none"
          />
          <button className="absolute right-2 top-1.5 w-9 h-9 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ServicesTab() {
  const services = [
    { icon: BedDouble, name: "Housekeeping" },
    { icon: Utensils, name: "In-Room Dining" },
    { icon: Bath, name: "Spa Booking" },
    { icon: Car, name: "Valet / Transport" },
    { icon: Clock, name: "Wake-up Call" },
    { icon: MessageSquare, name: "Reception" }
  ];

  return (
    <div className="pt-12 px-6">
      <h1 className="font-serif text-3xl text-[#1C1C1C] mb-2">Hotel Services</h1>
      <p className="text-[#8C857B] text-sm mb-8">Request services instantly to your room.</p>

      <div className="grid grid-cols-2 gap-4">
        {services.map((svc, idx) => (
          <button key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E0D8] flex flex-col items-center text-center gap-3 hover:border-[#BCA37F] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#F0ECE4] flex items-center justify-center group-hover:bg-[#1C1C1C] transition-colors">
              <svc.icon size={22} className="text-[#1C1C1C] group-hover:text-[#BCA37F]" />
            </div>
            <span className="text-sm font-medium text-[#1C1C1C]">{svc.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 bg-[#1C1C1C] rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg text-[#BCA37F] mb-1">Need something else?</h3>
          <p className="text-white/70 text-xs">Your AI Concierge can handle custom requests.</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronRight size={20} className="text-[#BCA37F]" />
        </button>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="pt-12 px-6 pb-6">
      <h1 className="font-serif text-3xl text-[#1C1C1C] mb-8">Profile</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E0D8] text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-[#1C1C1C] text-[#BCA37F] flex items-center justify-center mx-auto mb-4 text-3xl font-serif">
          V
        </div>
        <h2 className="text-2xl font-serif text-[#1C1C1C]">{GUEST.name} {GUEST.lastName}</h2>
        <p className="text-sm text-[#8C857B] mb-4">Room {GUEST.room}</p>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <span className="bg-[#F0ECE4] text-[#1C1C1C] text-xs font-semibold px-3 py-1.5 rounded-full">VIP Guest</span>
          <span className="bg-[#F0ECE4] text-[#1C1C1C] text-xs font-semibold px-3 py-1.5 rounded-full">Vegetarian</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C857B] mb-3">AI Personalization</h3>
          <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
            <ProfileRow icon={Sparkles} label="Diet & Interests" value="3 preferences set" />
            <div className="border-t border-[#E5E0D8]"></div>
            <ProfileRow icon={Settings} label="Auto-Adjust Plans" value="Enabled" toggle />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C857B] mb-3">Account Settings</h3>
          <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
            <ProfileRow icon={CreditCard} label="Payment Methods" />
            <div className="border-t border-[#E5E0D8]"></div>
            <ProfileRow icon={Bell} label="Notifications" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value, toggle }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-[#F9F8F6] transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[#8C857B]" />
        <span className="text-sm font-medium text-[#1C1C1C]">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && !toggle && <span className="text-xs text-[#8C857B]">{value}</span>}
        {toggle ? (
          <div className="w-10 h-6 bg-[#1C1C1C] rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
        ) : (
          <ChevronRight size={16} className="text-[#8C857B]" />
        )}
      </div>
    </div>
  );
}

function NavIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[64px]">
      <Icon size={22} className={active ? "text-[#1C1C1C]" : "text-[#A39C93]"} />
      <span className={`text-[10px] font-medium ${active ? "text-[#1C1C1C]" : "text-[#A39C93]"}`}>{label}</span>
    </button>
  );
}

// --- ADMIN DASHBOARD ---
// Keeping the Admin Dashboard intact for the Demo controller
function AdminDashboard({ weather, itinerary, showAIIntervention }) {
  const isConflict = weather === 'rainy' && itinerary.some(i => i.isVulnerableToWeather);
  const isResolved = weather === 'rainy' && itinerary.some(i => i.aiAdjusted);

  return (
    <div className="min-h-screen flex bg-[#F0ECE4]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1C1C1C] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-[#BCA37F]" />
            <span className="font-serif text-xl tracking-wide">Atithi AI</span>
          </div>
          <p className="text-white/50 text-xs">Hotel Command Center</p>
        </div>
        
        <div className="p-4 space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active />
          <SidebarItem icon={User} label="Active Guests" count={124} />
          <SidebarItem icon={Sparkles} label="AI Control Center" alert={isConflict} />
          <SidebarItem icon={Bell} label="Service Requests" count={12} />
          <SidebarItem icon={CalendarDays} label="Bookings" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[#1C1C1C]">AI Operations Dashboard</h1>
            <p className="text-[#6B655C]">Real-time guest personalization overview</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-[#E5E0D8] flex items-center gap-3">
              <Thermometer size={18} className="text-[#8C857B]" />
              <div className="flex flex-col">
                <span className="text-xs text-[#8C857B] uppercase font-semibold">Live Weather</span>
                <span className="text-sm font-medium capitalize text-[#1C1C1C]">
                  {weather} (Detecting Context)
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard title="Active AI Interventions" value={isConflict ? "1" : "0"} trend={isConflict ? "Requires attention" : "All clear"} alert={isConflict} />
          <StatCard title="Auto-Resolved by AI" value="48" trend="+12% today" />
          <StatCard title="Guest Satisfaction (AI)" value="4.9/5" trend="Top 5% globally" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-[#E5E0D8] p-6">
            <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
              <User size={18} /> Live Guest Activity
            </h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isConflict ? 'bg-red-50 border-red-100' : isResolved ? 'bg-[#F9F8F6] border-[#BCA37F]' : 'border-[#E5E0D8]'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center font-serif">V</div>
                    <div>
                      <h3 className="font-medium text-[#1C1C1C]">Virat Sharma <span className="text-xs font-normal text-[#8C857B] bg-[#F0ECE4] px-2 py-0.5 rounded ml-2">Room 402</span></h3>
                      <p className="text-xs text-[#6B655C]">VIP • Vegetarian • Wellness Focus</p>
                    </div>
                  </div>
                </div>

                {isConflict && (
                  <div className="bg-white p-3 rounded-lg border border-red-100 mt-2">
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                      <CloudRain size={16} /> <span className="text-sm font-semibold">Weather Conflict Detected (4:00 PM)</span>
                    </div>
                    <p className="text-sm text-[#1C1C1C] mb-2">Outdoor Botanical Garden Walk compromised.</p>
                  </div>
                )}

                {isResolved && (
                  <div className="bg-white p-3 rounded-lg border border-[#E5E0D8] mt-2">
                    <div className="flex items-center gap-2 text-[#1C1C1C] mb-1">
                      <Check size={16} className="text-green-600" /> <span className="text-sm font-semibold">Guest accepted AI Alternative</span>
                    </div>
                    <p className="text-sm text-[#6B655C]">Swapped 'Botanical Walk' for 'National Art Museum' due to rain.</p>
                  </div>
                )}
                
                {!isConflict && !isResolved && (
                  <div className="bg-[#F0ECE4] p-3 rounded-lg mt-2">
                    <p className="text-sm text-[#6B655C]">Enjoying Private City Tour. Next: Lunch at The Courtyard.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, count, alert }) {
  return (
    <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} className={alert ? "text-red-400" : active ? "text-[#BCA37F]" : ""} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {count && <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">{count}</span>}
      {alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
    </button>
  );
}

function StatCard({ title, value, trend, alert }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border ${alert ? 'border-red-200' : 'border-[#E5E0D8]'}`}>
      <h3 className="text-sm font-medium text-[#8C857B] mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <span className={`text-3xl font-serif ${alert ? 'text-red-600' : 'text-[#1C1C1C]'}`}>{value}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${alert ? 'bg-red-50 text-red-600' : 'bg-[#F0ECE4] text-[#6B655C]'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
