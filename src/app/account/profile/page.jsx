"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, User, CheckCircle2, AlertCircle } from "lucide-react";

const AVATAR_SIZE = 256;

function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Not a valid image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const ctx = canvas.getContext("2d");
        // Cover-fit crop: scale so the shorter side fills the square, then
        // center-crop the overflow on the longer side.
        const scale = Math.max(AVATAR_SIZE / img.width, AVATAR_SIZE / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (AVATAR_SIZE - w) / 2, (AVATAR_SIZE - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["account-profile"],
    queryFn: async () => {
      const res = await fetch("/api/account/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.user) setName(data.user.name || "");
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (body) => {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update profile");
      return json.user;
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["account-profile"] });
    },
    onError: (err) => setError(err.message),
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(false);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPreview(dataUrl);
      mutation.mutate({ image: dataUrl });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    mutation.mutate({ name });
  };

  const currentImage = preview || data?.user?.image;

  return (
    <div
      style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #EEF2FF 100%)" }}
      className="min-h-screen py-16 font-poppins"
    >
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
          <h1 className="text-2xl font-black text-gray-900 mb-8 text-center">
            My Profile
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full overflow-hidden group"
                  title="Change profile picture"
                >
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <User size={40} className="text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={22} className="text-white" />
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-3">
                  Click the picture to change it
                </p>
              </div>

              <form onSubmit={handleNameSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    disabled
                    value={data?.user?.email || ""}
                    className="w-full bg-gray-100 border border-gray-100 rounded-xl py-4 px-5 outline-none text-sm font-medium text-gray-400"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-bold">
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                  </div>
                )}
                {success && !error && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-3 border border-green-100 text-sm font-bold">
                    <CheckCircle2 size={18} className="shrink-0" />
                    Saved.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
                  className="w-full text-white py-4 rounded-2xl font-black hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
