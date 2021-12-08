import { useUsers } from "../state/users";
import { useUser } from "@compose-run/client";

export default function UserSettings() {
  const [users, dispatchUpdateUserAction] = useUsers();
  const user = useUser();
  return user !== null ? (
    <div>
      Change your username:
      <input
        type="text"
        name="username"
        value={users[user.id] || user.id}
        onChange={(e) => {
          dispatchUpdateUserAction(e.target.value);
        }}
      />
    </div>
  ) : (
    <></>
  );
}
