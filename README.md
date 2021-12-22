# Compose Community

This is the Compose Community's chat app (instead of Discord or Slack).

It was built to dogfood the [Compose backend-as-a-service](http://compose.run), explore "fullstack components", co-created community software, and end-programmer programming.

## How to use

- Install dependencies `npm install`
- Run app pointed at prod Compose server `npm start`

## Project structure

This project uses Create React App for hot-module reloading.

- `public/`
  - `index.html` - entry point, where React binds to, some styles
  - `manifest.json` - [read more here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
- `src/`
  - `App.tsx` (the top-level React component)
  - `components/` (all the React components)
  - `state/` (all the Compose state)

## Branches & migrations

This project uses a custom branching & migration system.

All Compose state is prefixed with the git branch name and commit hash. This means that each branch & commit has isolated state. Upon normal usage (committing to a branch or merging to main), each new state pulls its `initialState` from the last state of the prior commit hash's state.

If it doesn't find any state in the previous branch's commit, it goes back up to 10 commit hashes on that branch, and on main. (This limitation is partially why we squash branches before merging into main.) So when you branch off main, you get an isolated copy of the application state. When you merge back into main, your app pulls its state from the prior commit hash's state on main.

This scheme also allows you to run migrations. You can simply add a `.then` to `initialState` value and run the migration function on the previous state for that name. For example:

```ts
type User = { name: string };
type UsersDBOld = { [userId: number]: string };
type UsersDB = { [userId: number]: User };

const users = "user-settings";

const migration = (state: UsersDB | UsersDBOld): UsersDB => {
  if (typeof Object.values(state)[0] === "object") {
    // Important: Don't forget to handle the case where the migration already ran
    return state as UsersDB;
  } else {
    // This is the migration
    return Object.fromEntries(
      Object.entries(state).map(([id, name]) => [id, { name }])
    );
  }
};

export const useUsers = () =>
  useCloudReducer<UsersDB, UserAction, UserActionError>({
    name: `${appName}/${users}`,
    initialState: getPreviousState(users, {}).then(migration), // <- This is how you add the migration
    reducer: (users, action, { userId }): UsersDB => {
      users[userId] = { name: action };
      return users;
    },
  });
```

As indicated above, it's important to handle the case where the migration already ran, because you'll likely leave this migration step around until you need to add a new migration.

## Deployment

Deployment happens automatically on new pull requests and on merging to main, via Vercel.
