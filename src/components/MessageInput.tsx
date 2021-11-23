import { useState } from "react";
import { Channel, channels } from "../App";
import { useMessages } from "../state/messages";
import { useUser } from "../state/users";

export default function MessageInput({
  channel,
  setChannel,
}: {
  channel: Channel;
  setChannel: (channel: Channel) => void;
}) {
  const user = useUser();
  const [, dispatchMessageAction] = useMessages();
  const [message, setMessage] = useState("");

  function sendMessage() {
    if (message.length && channel !== "all") {
      dispatchMessageAction({
        type: "MessageCreate",
        sender: user.id,
        body: message,
        tags: [channel], // TODO - find all tags
      });
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
          // not for mobile
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            setMessage("");
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
      {/* need send button for mobile */}
    </div>
  );
}
