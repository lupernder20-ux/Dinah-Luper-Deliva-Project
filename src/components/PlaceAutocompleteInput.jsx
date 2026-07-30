"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";

const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

export default function PlaceAutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  name,
  required,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (input) => {
    if (!LOCATIONIQ_API_KEY || !input.trim()) {
      setSuggestions([]);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const url = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
        input,
      )}&limit=5&dedupe=1&format=json&countrycodes=ng`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        setSuggestions([]);
        return;
      }
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("LocationIQ autocomplete error", err);
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    onChange(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 300);
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.display_name);
    onSelect?.({
      address: suggestion.display_name,
      lat: Number(suggestion.lat),
      lng: Number(suggestion.lon),
      placeId: suggestion.place_id,
    });
    setSuggestions([]);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        name={name}
        required={required}
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && (loading || suggestions.length > 0) && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {loading && (
            <div className="px-5 py-3 text-sm text-gray-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </div>
          )}
          {!loading &&
            suggestions.map((s, i) => (
              <button
                type="button"
                key={s.place_id ?? i}
                onClick={() => handleSelect(s)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-5 py-3 flex items-start gap-3 text-sm transition-colors ${
                  activeIndex === i ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-50`}
              >
                <MapPin size={16} className="text-[#0A84FF] mt-0.5 shrink-0" />
                <span>
                  <span className="font-bold text-gray-800 block">
                    {s.display_place || s.display_name.split(",")[0]}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {s.display_address || s.display_name}
                  </span>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}