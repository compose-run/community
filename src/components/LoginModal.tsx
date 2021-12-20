import { useEffect, useState } from "react";
import { magicLinkLogin, useUser } from "@compose-run/client";
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
  const user = useUser();
  useEffect(() => {
    if (user) setShowLoginModal(false);
  }, [user, setShowLoginModal]);

  type EmailState = "idle" | "loading" | "success" | "error";
  const [emailSent, setEmailSent] = useState<EmailState>("idle");

  let display = <></>;
  if (emailSent === "idle" || emailSent === "loading") {
    display = (
      <div>
        <input
          autoFocus
          className={`${emailSent === "loading" ? "loading" : ""}`}
          disabled={emailSent === "loading"}
          style={{
            width: "80%",
            fontSize: "1.2em",
            color: "#6e6c6c",
            marginTop: "25px",
          }}
          placeholder="you@email.com"
          onKeyPress={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setEmailSent("loading");
              await magicLinkLogin({
                email: (e.target as HTMLInputElement).value,
                appName: "Compose Community",
              });
              setEmailSent("success");
            }
          }}
        ></input>
      </div>
    );
  } else if (emailSent === "success") {
    display = (
      <div
        style={{
          width: "80%",
          fontSize: "1.2em",
          color: "#6e6c6c",
          marginTop: "25px",
          border: "none",
        }}
      >
        Check your inbox for a login link!
      </div>
    );
  } else if (emailSent === "error") {
    // TOOD
  }

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
        {display}
      </div>
    </Modal>
  );
}
