import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";

type UsersDB = { [userId: number]: string };

export type UserAction = string;

const usersName = `${appName}/user-settings-1`;

export enum UserActionError {
  NameTaken,
}

export const useUsers = () =>
  useCloudReducer<UsersDB, UserAction, UserActionError | null>({
    name: usersName,
    initialState: {},
    reducer: (users, username, { userId, resolve }): UsersDB => {
      if (Object.values(users).includes(username)) {
        resolve(UserActionError.NameTaken);
      } else {
        users[userId] = username;
        resolve(null);
      }
      return users;
    },
  });
