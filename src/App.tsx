import { useEffect, useState } from "react";
import Header from "./components/Header";
import Messages from "./components/Messages";
import MessageInput from "./components/MessageInput";
import { useUser } from "@compose-run/client";
import WelcomeModal from "./components/WelcomeModal";
import UserSettings from "./components/UserSettings";

export const channels = ["all", "#intro", "#help", "#demo"];
export const channelColors = [
  "lightgray",
  "#ffb3ff",
  "lightblue",
  "lightgreen",
];
export type Channel = typeof channels[number];

export default function ChatApp() {
  const [channel, setChannel] = useState("all");

  const user = useUser();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true); // TODO make false initial state

  // navigate with arrow keys
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (["TEXTAREA", "INPUT"].includes((e.target as HTMLElement).nodeName))
        return;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        changeTag(-1, channel, setChannel);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        changeTag(1, channel, setChannel);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [channel, setChannel]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
        padding: 10,
        width: "100%",
      }}
    >
      <Header channel={channel} setChannel={setChannel} />
      <Messages channel={channel} />
      <MessageInput channel={channel} setChannel={setChannel} />
      {!user && (
        <WelcomeModal
          showWelcomeModal={showWelcomeModal}
          setShowWelcomeModal={setShowWelcomeModal}
        />
      )}
      <UserSettings />
    </div>
  );
}

function changeTag(
  direction: number,
  channel: string,
  setChannel: (channel: Channel) => void
) {
  setChannel(
    channels[
      Math.min(
        channels.length - 1,
        Math.max(0, channels.indexOf(channel) + direction)
      )
    ]
  );
}
