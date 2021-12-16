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
        className={waitingUsernameSet ? "animate-pulse" : ""}
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
            disabled={waitingUsernameSet}
            style={{
              width: "80%",
              fontSize: "1.2em",
              color: "#6e6c6c",
              marginTop: "25px",
              paddingLeft: ".3em",
              // would be nice to have it show the input border if the input is not selected
              // but there's no css hover state selectors natively in react
              // maybe we'll move to tailwind or some other lib that supports that
              border: "none",
            }}
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setWaitingForUsernameSet(true);
                dispatchUpdateUserAction((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
