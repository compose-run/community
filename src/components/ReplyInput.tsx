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
    <>
      <div style={{ display: "flex", marginLeft: 20, position: "relative" }}>
        <textarea
          autoFocus
          rows={message.split("\n").length}
          value={message}
          style={{ width: "100%", padding: 7 }}
          placeholder={"Send reply"}
          onKeyPress={(e) => {
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
        <span className="absolute inset-r-0 right-0 bottom-0 flex items-center pr-5 pb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sendMessage();
            }}
            className="p-1 focus:outline-none focus:shadow-outline"
          >
            ➡️
          </button>
        </span>
      </div>
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        message="Create an account to send your message"
      />
    </>
  );
}
