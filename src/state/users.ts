import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";

type UsersDB = { [userId: number]: string };

export type UserAction = string;
type UserActionError = string;

const usersName = `${appName}/user-settings-1`;

export const useUsers = () =>
  useCloudReducer<UsersDB, UserAction, UserActionError>({
    name: usersName,
    initialState: {},
    reducer: (users, action, { userId }): UsersDB => {
      users[userId] = action;
      return users;
    },
  });
