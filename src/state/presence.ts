import { useCloudReducer } from "@compose-run/client";
import { appName, getPreviousState } from "./appName";
import { useEffect } from "react";
import { useUser } from "@compose-run/client";

// Maps user id to "last seen" unix timestamp.
type PresenceDB = { [userId: number]: number };

export type PresenceAction = number;
type PresenceActionError = string;

const presence = "user-presence";

export const usePresence = () => {
  const [presenceDb, dispatchPresence] = useCloudReducer<
    PresenceDB,
    PresenceAction, // action
    PresenceActionError
  >({
    name: `${appName}/${presence}`,
    initialState: getPreviousState(presence, {}),
    reducer: ({ previousState: users, userId }) => {
      if (userId) {
        users[userId] = Date.now();
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
