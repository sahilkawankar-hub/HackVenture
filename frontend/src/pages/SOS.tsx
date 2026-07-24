import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Phone,
  Shield,
  MapPin,
  Ambulance,
  Radio,
  CheckCircle2,
  UserPlus,
  Compass,
  Bell,
  Clock,
  X,
  Volume2,
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

interface NearbyFacility {
  id: string;
  name: string;
  type: "Hospital" | "Police" | "Fire Station";
  distance: string;
  address: string;
  phone: string;
}

const initialContacts: EmergencyContact[] = [
  { id: "ec1", name: "David Johnson", relation: "Spouse", phone: "+1 (555) 901-2345", isPrimary: true },
  { id: "ec2", name: "Sarah Jenkins", relation: "Neighbor & Friend", phone: "+1 (555) 456-7890" },
  { id: "ec3", name: "Dr. Aris Thorne", relation: "Family Physician", phone: "+1 (555) 321-7890" },
];

const nearbyFacilities: NearbyFacility[] = [
  { id: "f1", name: "Greenwood Heights General Hospital", type: "Hospital", distance: "0.8 miles", address: "450 Medical Center Blvd", phone: "911 / (555) 999-0100" },
  { id: "f2", name: "78th Precinct Police Station", type: "Police", distance: "1.2 miles", address: "120 Police Plaza", phone: "911 / (555) 999-0200" },
  { id: "f3", name: "Fire Department Station #14", type: "Fire Station", distance: "0.5 miles", address: "80 Rescue Way", phone: "911 / (555) 999-0300" },
];

function SOS() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isHolding, setIsHolding] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);

  // New Contact Form Modal
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Live Location
  const [coords, setCoords] = useState({ lat: 40.6654, lng: -73.9876 });
  const [address] = useState("12 Elm St, Greenwood Heights, NY 11215");

  // Press & Hold Countdown Effect
  useEffect(() => {
    let interval: any;
    if (isHolding && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (isHolding && countdown === 0) {
      setIsSosActive(true);
      setIsHolding(false);
    } else if (!isHolding && !isSosActive) {
      setCountdown(3);
    }
    return () => clearInterval(interval);
  }, [isHolding, countdown, isSosActive]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const created: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: newName,
      relation: newRelation || "Contact",
      phone: newPhone,
    };

    setContacts([...contacts, created]);
    setShowAddContact(false);
    setNewName("");
    setNewRelation("");
    setNewPhone("");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            24/7 Community Emergency &amp; SOS Network
          </div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Emergency SOS Dispatch</h1>
          <p className="text-sm text-[#434655] mt-1">
            Instantly broadcast high-priority emergency alerts to 911, nearby responders, and emergency contacts.
          </p>
        </div>

        {isSosActive && (
          <button
            onClick={() => setIsSosActive(false)}
            className="bg-red-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-red-700 animate-pulse shrink-0"
          >
            <X className="w-4 h-4" />
            Cancel Active SOS Alert
          </button>
        )}
      </div>

      {/* ── Active SOS Banner Card ──────────────────────────────────────── */}
      {isSosActive ? (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-700 text-white rounded-3xl p-8 shadow-2xl space-y-6 border-4 border-red-400 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Radio className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <h2 className="text-2xl font-black">ACTIVE SOS BROADCAST DISPATCHED</h2>
                <p className="text-xs text-red-100">Live GPS tracking active · Local First Responders notified</p>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-white text-red-700 rounded-full text-xs font-black uppercase">
              CRITICAL EMERGENCY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-red-200">Dispatched Responders</p>
              <p className="text-lg font-black text-white mt-1">First Responder Unit #91</p>
            </div>
            <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-red-200">Estimated Arrival ETA</p>
              <p className="text-lg font-black text-amber-300 mt-1">3.5 Minutes</p>
            </div>
            <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-red-200">Emergency Contacts</p>
              <p className="text-lg font-black text-emerald-300 mt-1">3 Contacts Notified</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── Big SOS Trigger Button Section ──────────────────────────────── */
        <div className="bg-white rounded-3xl p-8 border border-[#c3c6d7]/50 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-[#0b1c30]">Emergency Trigger Button</h3>
            <p className="text-xs text-[#434655]">
              Press and hold the red SOS button below for 3 seconds to trigger an instant emergency alert.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <button
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              className={`w-44 h-44 rounded-full font-black text-3xl text-white shadow-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 ${
                isHolding
                  ? "bg-red-700 scale-110 ring-8 ring-red-400"
                  : "bg-gradient-to-br from-red-600 via-red-500 to-rose-700 hover:scale-105"
              }`}
            >
              <AlertTriangle className="w-10 h-10 mb-1" />
              <span>{isHolding ? `${countdown}s` : "SOS"}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 opacity-80 mt-1">
                {isHolding ? "HOLD TIGHT" : "PRESS & HOLD"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ── Main SOS Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Location & GPS Status */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#004ac6]" />
              <h3 className="text-base font-bold text-[#0b1c30]">Live GPS Location</h3>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              GPS Lock Accurate (±3m)
            </span>
          </div>

          <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#c3c6d7]/30 space-y-3 text-xs">
            <div className="flex items-start gap-2 text-[#0b1c30]">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Current Address</p>
                <p className="text-[#434655]">{address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="p-2.5 bg-white rounded-xl border border-[#c3c6d7]/20">
                <span className="text-[#434655] font-medium">Latitude:</span>
                <p className="font-bold font-mono text-[#004ac6]">{coords.lat}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#c3c6d7]/20">
                <span className="text-[#434655] font-medium">Longitude:</span>
                <p className="font-bold font-mono text-[#004ac6]">{coords.lng}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-[#0b1c30]">Emergency Contacts</h3>
            </div>
            <button
              onClick={() => setShowAddContact(true)}
              className="text-xs font-bold text-[#004ac6] hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Contact
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#c3c6d7]/30 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#0b1c30] text-sm">{contact.name}</p>
                    {contact.isPrimary && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[#434655] mt-0.5">{contact.relation} · {contact.phone}</p>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="px-3.5 py-2 bg-[#004ac6] text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#2563eb]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Facilities */}
        <div className="lg:col-span-12 bg-white p-6 rounded-3xl border border-[#c3c6d7]/50 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-[#0b1c30]">Nearby Medical &amp; First Responders</h3>
            </div>
            <span className="text-xs font-semibold text-[#434655]">3 Facilities Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyFacilities.map((fac) => (
              <div key={fac.id} className="p-5 bg-[#f8f9ff] rounded-2xl border border-[#c3c6d7]/30 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#004ac6] bg-[#004ac6]/10 px-2 py-0.5 rounded-full">
                      {fac.type}
                    </span>
                    <h4 className="font-bold text-sm text-[#0b1c30] mt-1">{fac.name}</h4>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {fac.distance}
                  </span>
                </div>

                <p className="text-[#434655]">{fac.address}</p>

                <div className="pt-2 border-t border-[#c3c6d7]/20 flex justify-between items-center">
                  <span className="font-mono text-[#0b1c30] font-semibold">{fac.phone}</span>
                  <a
                    href={`tel:${fac.phone}`}
                    className="px-3 py-1.5 bg-[#004ac6] text-white rounded-xl font-bold flex items-center gap-1 hover:bg-[#2563eb]"
                  >
                    <Phone className="w-3 h-3" />
                    Dial
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Contact Modal ───────────────────────────────────────────── */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl border border-[#c3c6d7]/50">
            <div className="flex justify-between items-center border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-lg font-bold text-[#0b1c30]">Add Emergency Contact</h3>
              <button onClick={() => setShowAddContact(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-[#434655]" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Relationship</label>
                <input
                  type="text"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="e.g. Spouse, Parent, Neighbor"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-xs text-[#0b1c30]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] font-semibold text-[#434655]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md"
                >
                  Save Emergency Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOS;
