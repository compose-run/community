import { useState } from "react";
import { magicLinkLogin } from "@compose-run/client";
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
  const [emailSent, setEmailSent] = useState(false);
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
        {emailSent ? (
          <div
            style={{
              width: "80%",
              fontSize: "1.2em",
              color: "#6e6c6c",
              marginTop: "25px",
              paddingLeft: ".3em",
              border: "none",
            }}
          >
            Check your inbox for a login link!
          </div>
        ) : (
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
                  setEmailSent(true);
                }
              }}
            ></input>
          </div>
        )}
        {/* TODO - need send button for mobile */}
      </div>
    </Modal>
  );
}
