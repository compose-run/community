// import appName from "./appName";
// import { useCloudReducer } from "../compose-client-dist/module";

// TODO - this should be auto imported from compose-client-dist
export interface User {
  id: number;
  email: string;
}

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
