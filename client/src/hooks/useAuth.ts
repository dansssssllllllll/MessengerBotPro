import { useAuth as useAuthContext } from "../contexts/AuthContext";

// This is a pass-through hook to make it easy to import the auth hook
export function useAuth() {
  return useAuthContext();
}
