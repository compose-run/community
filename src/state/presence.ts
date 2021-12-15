import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";
import { useEffect } from "react";
import { useUser } from "@compose-run/client";

// Maps user id to "last seen" unix timestamp.
type PresenceDB = { [userId: number]: number };

export type PresenceAction = number;
type PresenceActionError = string;

export const usePresence = () => {
  const [presenceDb, dispatchPresence] = useCloudReducer<
    PresenceDB,
    PresenceAction,
    PresenceActionError
  >({
    name: `${appName}/user-presence`,
    initialState: {},
    reducer: (users, _, { userId, timestamp }) => {
      if (userId) {
        users[userId] = timestamp;
      }
      return users;
    },
  });

  const userId = useUser();
  useEffect(() => {
    // dispatch presence now, and every 20 seconds thereafter
    dispatchPresence();
    const interval = setInterval(() => {
      dispatchPresence();
    }, 1000 * 20);
    return () => clearInterval(interval);
  }, [userId, dispatchPresence]);

  return Object.values(presenceDb || {}).filter(
    (lastSeen: number) => lastSeen > Date.now() - 30 * 1000
  ).length;
};
