import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export function useUserProfile() {
  const { data: authUser, loading: authLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/account/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({ ...authUser, ...data.user });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser, authLoading]);

  return { data: profile, loading, error };
}
