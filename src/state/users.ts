import { useCloudReducer, User } from "@compose-run/client";
import appName from "./appName";

type UserId = number;

type UsersDB = { [userId: UserId]: string };

type UserAction = string;
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
      users[userId] = action;
      return users;
    },
  }) as [UsersDB, (action: UserAction) => Promise<UserActionError>];
