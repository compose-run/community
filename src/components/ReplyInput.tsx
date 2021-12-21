import { useState } from "react";
import { useUser, User } from "@compose-run/client";
import { useMessages, MessageId } from "../state/messages";
import LoginModal from "./LoginModal";

// TODO: De-duplicate code between this and MessageInput.

export default function ReplyInput({
  replyTo,
  onReply,
}: {
  replyTo: MessageId;
  onReply?: () => void;
}) {
  const user: User | null = useUser();
  const [, dispatchMessageAction] = useMessages();
  const [dispatching, setDispatching] = useState(false);
  const [message, setMessage] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);

  async function actuallySendMessage() {
    if (!user) {
      return "Unauthorized";
    }

    setDispatching(true);
    let result = await dispatchMessageAction({
      type: "MessageCreate",
      sender: user.id, //  TODO -  set this via context, and link to username
      body: message,
      tags: [], // TODO - find all tags
      replyTo: replyTo,
    });
    setDispatching(false);

    setMessage("");
    onReply && onReply(); // TODO: pass result here?
    return result;
  }

  function sendMessage() {
    if (message.length < 1) {
      // TODO - error
    } else if (!user) {
      setShowLoginModal(true);
    } else {
      actuallySendMessage();
    }
  }

  return (
    <div style={{ display: "flex", marginLeft: 20 }}>
      <textarea
        autoFocus
        rows={message.split("\n").length}
        value={message}
        style={{ width: "100%", padding: 7 }}
        placeholder={
          "Reply message"
          // TODO: Reply to <username> maybe?
        }
        onKeyPress={(e) => {
          // TODO - disable for mobile
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        onChange={(e) => {
          setMessage((e.target as HTMLTextAreaElement).value);
        }}
        className={dispatching ? "loading" : ""}
        disabled={dispatching}
      />
      {/* TODO - need send button for mobile */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        message="Create an account to send your message"
      />
    </div>
  );
}
