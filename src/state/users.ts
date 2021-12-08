import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";

type UsersDB = { [userId: number]: string };

export type UserAction = string;
type UserActionError = string;

// interface SetUserName {
//   type: "SetUserName";
//   username: string;
// }

const usersName = `${appName}/user-settings`;

export const useUsers = () =>
  useCloudReducer<UsersDB, UserAction, UserActionError>({
    name: usersName,
    initialState: {},
    reducer: (users, action, { resolve, userId }): UsersDB => {
      console.log("test");
      console.log([users, action, userId]);
      (users || {})[userId] = action;
      console.log([users, action, userId]);
      return users;
    },
  }) as [UsersDB, (action: UserAction) => Promise<UserActionError>];
