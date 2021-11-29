import { magicLinkLogin } from "../compose-client-dist/module";
import Modal from "./Modal";

export default function LoginModal({
  showLoginModal,
  setShowLoginModal,
  message,
}: {
  showLoginModal: boolean;
  setShowLoginModal: (showLoginModal: boolean) => void;
  message: string;
}) {
  return (
    <Modal show={showLoginModal} onClose={() => setShowLoginModal(false)}>
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
          {message}
        </div>
        <div>
          <input
            autoFocus
            style={{
              width: "80%",
              fontSize: "1.2em",
              color: "#6e6c6c",
              marginTop: "25px",
              paddingLeft: ".3em",
              border: "none",
            }}
            placeholder="you@email.com"
            onKeyPress={(e) => {
              // TODO - disable for mobile
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                magicLinkLogin({
                  email: (e.target as HTMLInputElement).value,
                  appName: "Compose Community",
                  redirectURL: undefined, // defaults to current page
                });
              }
            }}
          ></input>
        </div>
        {/* TODO - need send button for mobile */}
      </div>
    </Modal>
  );
}
