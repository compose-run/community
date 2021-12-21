import { useState } from "react";
import { useUsers } from "../state/users";
import Modal from "./Modal";

export default function SetUsernameModal({
  showUsernameModal,
  setShowUsernameModal,
}: {
  showUsernameModal: boolean;
  setShowUsernameModal: (showUsernameModal: boolean) => void;
}) {
  const [, dispatchUpdateUserAction] = useUsers();
  const [waitingUsernameSet, setWaitingForUsernameSet] = useState(false);

  return (
    <Modal show={showUsernameModal} onClose={() => setShowUsernameModal(false)}>
      <div
        style={{
          marginTop: 35,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: "1.35em",
            fontWeight: 300,
          }}
        >
          Set your username
        </div>
        <div>
          <input
            type="text"
            name="username"
            autoFocus
            style={{
              width: "80%",
              fontSize: "1.2em",
              color: "#6e6c6c",
              marginTop: "25px",
              paddingLeft: ".3em",
            }}
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setWaitingForUsernameSet(true);
                await dispatchUpdateUserAction(
                  (e.target as HTMLInputElement).value
                );
                setWaitingForUsernameSet(false);
                setShowUsernameModal(false);
              }
            }}
            disabled={waitingUsernameSet}
            className={
              (waitingUsernameSet ? "loading " : "") + "focus:border-0"
            }
          />
        </div>
      </div>
    </Modal>
  );
}
