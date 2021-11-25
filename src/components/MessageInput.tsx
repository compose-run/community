import { useEffect, useRef, useState } from "react";
import { Channel, channelColors, channels } from "../App";
import { magicLinkLogin, useUser } from "../compose-client-dist/module";
import { useMessages } from "../state/messages";
import Modal from "./Modal";
import { User } from "../state/users";

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
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [showTagModal, setShowTagModal] = useState(false);

  async function actuallySendMessage() {
    let result = dispatchMessageAction({
      type: "MessageCreate",
      sender: user?.id, //  TODO -  set this via context, and link to username
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
      setTimeout(() => emailInputRef.current?.focus(), 0);
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
        emailInputRef={emailInputRef}
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

function LoginModal({
  showLoginModal,
  setShowLoginModal,
  emailInputRef,
}: {
  showLoginModal: boolean;
  setShowLoginModal: (showLoginModal: boolean) => void;
  emailInputRef: React.RefObject<HTMLInputElement>;
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
            marginBottom: 38,
            fontSize: "1.35em",
            fontWeight: 300,
          }}
        >
          Create an account to send your message
        </div>
        <div>
          <input
            ref={emailInputRef}
            style={{
              width: "80%",
              fontSize: "1.2em",
              color: "#6e6c6c",
              marginTop: "3px",
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
  actuallySendMessage: () => Promise<string>;
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
          {channels.slice(1).map((channel, channelIndex) => (
            <button
              key={channel}
              onClick={() => {
                setChannel(channel);
                actuallySendMessage();
                setShowTagModal(false);
              }}
              onMouseEnter={() => {
                setChannel(channel);
              }}
              style={{
                backgroundColor: channelColors[channelIndex],
                borderRadius: "3px",
                padding: "5px",
                // TODO - style selected when selected
              }}
            >
              {channel}
            </button>
          ))}
        </div>
        {/* TODO - need send button for mobile */}
      </div>
    </Modal>
  );
}
