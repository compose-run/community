import { useState } from "react";
import Header from "./components/Header";
import Messages from "./components/Messages";
import MessageInput from "./components/MessageInput";

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
    </div>
  );
}
