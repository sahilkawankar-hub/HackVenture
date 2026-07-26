import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * IssueMapCard — interactive live map preview with browser GPS + IP Geolocation fallback & manual search.
 */
function IssueMapCard() {
  const navigate = useNavigate();

  // Default to New Delhi, India
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.209,
  });
  const [locationName, setLocationName] = useState<string>("New Delhi, India");
  const [locationStatus, setLocationStatus] = useState<string>("Initializing...");
  const [isLive, setIsLive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Attempt IP-based location fallback (works when GPS is denied/disabled on desktop)
  const fetchIPLocation = () => {
    setLocationStatus("Fetching IP location...");
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.latitude && data.longitude) {
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);
          setCoords({ lat, lng });
          const city = data.city || data.region || "Local Area";
          const country = data.country_name || "India";
          setLocationName(`${city}, ${country}`);
          setIsLive(true);
          setLocationStatus(`Live via IP (${city})`);
        } else {
          throw new Error("Invalid IP location response");
        }
      })
      .catch((err) => {
        console.warn("IP Geolocation failed:", err);
        setLocationStatus("India Default (New Delhi)");
        setIsLive(false);
      })
      .finally(() => setLoading(false));
  };

  // Primary: Browser Geolocation API
  const fetchLiveLocation = () => {
    setLoading(true);
    setLocationStatus("Locating via GPS...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setIsLive(true);
          setLocationStatus("Live GPS Active");

          // Reverse geocode via free Nominatim API for display name
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data?.address) {
                const city =
                  data.address.city ||
                  data.address.town ||
                  data.address.suburb ||
                  data.address.county ||
                  data.address.state ||
                  "Live Location";
                const country = data.address.country || "India";
                setLocationName(`${city}, ${country}`);
              } else {
                setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            })
            .catch(() => setLocationName("Your Live Location"))
            .finally(() => setLoading(false));
        },
        (error) => {
          console.warn("Browser GPS unavailable/denied:", error.message);
          // Fall back to IP-based location detection
          fetchIPLocation();
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    } else {
      fetchIPLocation();
    }
  };

  // Handle manual location search (e.g., "Mumbai", "Bangalore", "Connaught Place Delhi")
  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setLocationStatus("Searching location...");

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery + ", India"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setCoords({ lat, lng });
          setLocationName(data[0].display_name.split(",").slice(0, 2).join(","));
          setIsLive(true);
          setLocationStatus("Custom Location");
          setShowSearch(false);
          setSearchQuery("");
        } else {
          alert("Location not found. Please try another city or neighborhood in India.");
        }
      })
      .catch(() => alert("Could not search location. Please check internet connection."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  return (
    <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/50 overflow-hidden flex flex-col h-[520px] hover:shadow-md transition-all">
      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap justify-between items-center border-b border-[#c3c6d7]/40 flex-shrink-0 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-[#0b1c30]">Issue Map</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isLive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              ● {locationStatus}
            </span>
          </div>
          <p className="text-[11px] text-[#434655] mt-0.5 font-medium">
            Real-time reports in <span className="text-[#004ac6] font-semibold">{locationName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {showSearch ? (
            <form onSubmit={handleSearchLocation} className="flex items-center gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city in India..."
                className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-xs text-slate-800 outline-none focus:border-[#004ac6] w-44"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#004ac6] text-white rounded-full text-xs font-semibold hover:bg-[#003aa0]"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full text-[10px] font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">search</span>
              Search City
            </button>
          )}

          <button
            onClick={fetchLiveLocation}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1 bg-[#e5eeff] text-[#004ac6] hover:bg-[#d4e4ff] rounded-full text-[10px] font-bold transition-colors disabled:opacity-50"
            title="Locate me using GPS or IP"
          >
            <span className="material-symbols-outlined text-[14px] animate-spin-slow">
              my_location
            </span>
            {loading ? "Locating..." : "Use My Location"}
          </button>

          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            3 High Priority
          </span>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-[#e5eeff] overflow-hidden">
        <iframe
          key={`${coords.lat}-${coords.lng}`}
          title="Live Location Issue Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed`}
        />

        {/* Floating issue card overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#c3c6d7]/30 max-w-[230px] animate-fade-in z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0b1c30] leading-tight">
                Water Main Leak
              </p>
              <p className="text-[11px] text-[#434655]">Reported 20m ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold uppercase">
              High Priority
            </span>
            <span className="text-[11px] text-[#434655] truncate ml-1 font-medium">
              {locationName}
            </span>
          </div>
          <button
            id="map-view-details-btn"
            onClick={() => navigate("/civic-eye")}
            className="w-full py-2 bg-[#004ac6] text-white rounded-lg text-[11px] font-bold hover:bg-[#003aa0] transition-colors shadow-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueMapCard;

