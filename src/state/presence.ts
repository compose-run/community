import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";
import { useState, useEffect } from "react";
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
    reducer: (users, lastSeen, { userId }) => {
      if (userId) {
        users[userId] = lastSeen;
      }
      return users;
    },
  });
  const userId = useUser();
  const [nw, setNw] = useState(Date.now());
  useEffect(() => {
    // dispatch presence on first, and every 20 seconds thereafter
    const interval = setInterval(() => {
      const nw = Date.now();
      setNw(nw);
      dispatchPresence(nw);
    }, 1000 * 20);
    return () => clearInterval(interval);
  }, [userId, dispatchPresence]); // do this effect when the userId changes
  if (presenceDb) {
    return Object.values(presenceDb).filter(
      (lastSeen: number) => lastSeen > nw - 30 * 1000
    ).length;
  } else {
    return 0;
  }
};
