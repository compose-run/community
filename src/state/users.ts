import { useCloudReducer } from "@compose-run/client";
import { appName, getPreviousState } from "./appName";

type User = { name: string };

type UsersDBOld = { [userId: number]: string };
type UsersDB = { [userId: number]: User };

export type UserAction = string;

const users = "user-settings";

const migration = (state: UsersDB | UsersDBOld): UsersDB => {
  if (typeof Object.values(state)[0] === "object") {
    // need to handle the case where the migrations already happened
    return state as UsersDB;
  } else {
    return Object.fromEntries(
      Object.entries(state).map(([id, name]) => [id, { name }])
    );
  }
};

export enum UserActionError {
  NameTaken,
}

export const useUsers = () =>
  useCloudReducer<UsersDB, UserAction, UserActionError | null>({
    name: `${appName}/${users}`,
    initialState: getPreviousState(users, {}).then(migration),
    reducer: (users, username, { userId, resolve }): UsersDB => {
      if (
        Object.values(users).filter((u) => u.name === username).length !== 0
      ) {
        resolve(UserActionError.NameTaken);
      } else {
        users[userId] = { name: username };
        resolve(null);
      }
      return users;
    },
  });
