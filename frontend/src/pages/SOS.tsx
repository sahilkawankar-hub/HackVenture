import { useState, useEffect } from "react";
import { AlertOctagon, MapPin, Phone, ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";
function SOS() {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [locationText, setLocationText] = useState("Fetching current coordinates...");
  const [emergencyContacts] = useState([
    { name: "Greenwood Security Post", phone: "+1 (555) 019-2831", role: "Guard House" },
    { name: "Municipal Emergency Dispatch", phone: "911", role: "Police / Fire / Ambulance" },
    { name: "Community Medical Response", phone: "+1 (555) 012-9988", role: "First Aid Unit" },
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationText(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Greenwood Heights)`);
        },
        () => {
          setLocationText("Greenwood Heights (GPS Signal Low)");
        }
      );
    }
  }, []);

  useEffect(() => {
    let timer: any;
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown]);

  const handleTriggerSOS = () => {
    setSosActive(true);
    setCountdown(5);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setCountdown(5);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="p-7 max-w-4xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="badge badge-red">
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Protocol
          </span>
          <h1 className="text-3xl font-black text-red-600 tracking-tight">
            Emergency SOS Beacon
          </h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Pressing the SOS button broadcasts your live GPS location to local security, emergency contacts, and nearby verified community responders.
          </p>
        </div>

        {/* ── SOS Trigger Button Area ───────────────────────────────────── */}
        <div className="card p-10 text-center space-y-6 relative overflow-hidden border-2 border-red-200 dark:border-red-900/40">
          {sosActive ? (
            <div className="space-y-6 animate-scale-in">
              <div className="w-32 h-32 rounded-full bg-red-600 text-white flex flex-col items-center justify-center mx-auto shadow-2xl animate-pulse">
                <span className="text-4xl font-black">{countdown}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest">Seconds</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-red-600">Broadcasting Emergency Alert...</h3>
                <p className="text-xs text-[#94a3b8] mt-1">Press cancel below if triggered by mistake.</p>
              </div>

              <button
                onClick={handleCancelSOS}
                className="px-8 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-[#0f1f3d] dark:text-white font-extrabold text-sm hover:bg-slate-300 transition-all"
              >
                CANCEL EMERGENCY ALERT
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleTriggerSOS}
                className="w-44 h-44 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex flex-col items-center justify-center mx-auto shadow-xl hover:scale-105 transition-transform active:scale-95 group cursor-pointer border-4 border-red-200 dark:border-red-900/50"
              >
                <AlertOctagon className="w-12 h-12 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-lg font-black tracking-wider">HOLD FOR SOS</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#94a3b8]">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{locationText}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Emergency Contacts List ───────────────────────────────────── */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-base border-b pb-3" style={{ color: "var(--text-primary)", borderColor: "var(--border-color)" }}>
            <ShieldCheck className="w-5 h-5 text-red-500" />
            Configured Emergency Response Network
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="p-4 rounded-2xl border space-y-2 bg-slate-50 dark:bg-slate-800/40" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center justify-between">
                  <UserCheck className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-bold text-[#94a3b8] uppercase">{contact.role}</span>
                </div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{contact.name}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" /> {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SOS;
