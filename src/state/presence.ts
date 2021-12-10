import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";
import { useState, useEffect } from "react";

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
      users[userId] = lastSeen;
      return users;
    },
  });
  const [numberOnline, setNumberOnline] = useState(0);
  useEffect(() => {
    setInterval(() => {
      const nw = Date.now();
      dispatchPresence(nw);
      console.log(presenceDb);
      setNumberOnline(
        Object.values(presenceDb || {}).filter(
          (lastSeen: number) => lastSeen > nw - 30 * 1000
        ).length
      );
    }, 1000 * 20);
  });
  return numberOnline;
};
