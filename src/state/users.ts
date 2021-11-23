import appName from "./appName";
import { useCloudReducer } from "../compose-client-dist/module";

export interface User {
  id: string;
}

export const useUser = () => ({
  id: "steve",
});

// export const useUsers = () =>
//   useCloudReducer({
//     name: `${appName}/users`,
//     initialState: [
//       {
//         id: "steve",
//       },
//     ],
//     reducer: (users: User[]) => users,
//   });
