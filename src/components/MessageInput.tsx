import { useEffect, useRef, useState } from "react";
import { Channel, channelColors, channels } from "../App";
import { useUser } from "../compose-client-dist/module";
import { MessageActionError, useMessages } from "../state/messages";
import Modal from "./Modal";
import { User } from "../state/users";
import LoginModal from "./LoginModal";

export default function MessageInput({
  channel,
  setChannel,
}: {
  channel: Channel;
  setChannel: (channel: Channel) => void;
}) {
  const user: User | null = useUser();
  const [, dispatchMessageAction] = useMessages();
  const [message, setMessage] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showTagModal, setShowTagModal] = useState(false);

  async function actuallySendMessage() {
    if (!user) {
      return "Unauthorized";
    }

    let result = dispatchMessageAction({
      type: "MessageCreate",
      sender: user.id, //  TODO -  set this via context, and link to username
      body: message,
      tags: [channel], // TODO - find all tags
    });
    setMessage("");
    return result;
  }

  function sendMessage() {
    if (message.length < 1) {
      // TODO - error
    } else if (!user) {
      setShowLoginModal(true);
    } else if (channel === "all") {
      setShowTagModal(true);
    } else {
      actuallySendMessage();
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <textarea
        rows={message.split("\n").length}
        value={message}
        style={{ width: "100%", padding: 7 }}
        placeholder={
          "Send message" + (channel === "all" ? "..." : ` to ${channel}`)
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
          const newChannel = channels
            .filter((c) => c !== "all" && c !== channel)
            .find(
              (c) =>
                e.target.value === c ||
                e.target.value.startsWith(c + " ") ||
                e.target.value.endsWith(" " + c) ||
                e.target.value.includes(" " + c + " ")
            );
          if (newChannel) {
            // TODO - remove all other channels via regex

            setChannel(newChannel);
          }
        }}
      />
      {/* TODO - need send button for mobile */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        message="Create an account to send your message"
      />
      <AddTagModal
        showTagModal={showTagModal}
        setShowTagModal={setShowTagModal}
        channel={channel}
        setChannel={setChannel}
        actuallySendMessage={actuallySendMessage}
      />
    </div>
  );
}

function AddTagModal({
  showTagModal,
  setShowTagModal,
  channel,
  setChannel,
  actuallySendMessage,
}: {
  showTagModal: boolean;
  setShowTagModal: (showTagModal: boolean) => void;
  channel: string;
  setChannel: (channel: Channel) => void;
  actuallySendMessage: () => Promise<MessageActionError>;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showTagModal) return;
    modalRef.current?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        actuallySendMessage();
        setShowTagModal(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [channel, showTagModal]);

  return (
    <Modal show={showTagModal} onClose={() => setShowTagModal(false)}>
      <div
        ref={modalRef}
        tabIndex={0}
        style={{
          marginTop: 35,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            marginBottom: 38,
            fontSize: "1.35em",
            fontWeight: 300,
          }}
        >
          Add a tag to your message
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {channels.slice(1).map((c, channelIndex) => (
            <button
              key={c}
              onClick={() => {
                setChannel(c);
                actuallySendMessage();
                setShowTagModal(false);
              }}
              onMouseEnter={() => {
                setChannel(c);
              }}
              style={{
                backgroundColor: channelColors[channelIndex + 1],
                borderRadius: "3px",
                padding: "5px",
                boxShadow:
                  c === channel ? "rgb(33 33 33 / 36%) 0px 0px 11px 0px" : "",
                transition: "box-shadow .3s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
