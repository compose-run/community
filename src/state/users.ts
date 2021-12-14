import { getCloudState, useCloudReducer } from "@compose-run/client";
import { appName, previousAppName } from "./appName";

type User = { name: string };

type UsersDBOld = { [userId: number]: string };
type UsersDB = { [userId: number]: User };

export type UserAction = string;
type UserActionError = string;

const users = "user-settings";

const migration = (state: UsersDB | UsersDBOld | null): UsersDB => {
  if (!state) {
    return {};
  } else if (typeof Object.values(state)[0] === "object") {
    // need to handle the case where the migrations already happened
    return state as UsersDB;
  } else {
    return Object.fromEntries(
      Object.entries(state).map(([id, name]) => [id, { name }])
    );
  }
};

export const useUsers = () =>
  useCloudReducer<UsersDB, UserAction, UserActionError>({
    name: `${appName}/${users}`,
    initialState: getCloudState<UsersDBOld>(`${previousAppName}/${users}`).then(
      migration
    ),
    reducer: (users, action, { userId }): UsersDB => {
      users[userId] = { name: action };
      return users;
    },
  });
