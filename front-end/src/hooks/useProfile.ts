import { useState, useEffect } from 'react';

interface Profile {
  id: string;
  step: 1 | 2;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem(import.meta.env.VITE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem(import.meta.env.VITE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(import.meta.env.VITE_STORAGE_KEY);
    }
  }, [profile]);

  const saveProfile = (id: string, step: 1 | 2) => {
    setProfile({ id, step });
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile };
}; 