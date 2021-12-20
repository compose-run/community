import { Channel } from "../App";
import { useMessages, MessageType } from "../state/messages";
import Message from "./Message";

export default function Messages({ channel }: { channel: Channel }) {
  const [messages] = useMessages();

  // flex, column-reverse, and extra div trick to make the messages scroll to the bottom
  // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up/21067431#comment79201655_44051405

  return (
    <div
      style={{
        flexGrow: 1,
        marginTop: 10,
        marginBottom: 10,
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <div>
        {messages ? (
          Object.values(messages)
            .filter(
              (message: MessageType) =>
                !message.replyTo &&
                (channel === "all" || message.tags.includes(channel))
            )
            .sort((a: MessageType, b: MessageType) => a.createdAt - b.createdAt)
            .map(
              (
                message: MessageType,
                index: number,
                messagesViewing: MessageType[]
              ) => (
                <Message
                  style={{
                    borderBottom:
                      index + 1 > messagesViewing.length ||
                      messagesViewing.slice(index + 1).every((m) => m.deleted)
                        ? "none"
                        : "1px solid lightgray",
                  }}
                  key={index}
                  message={message}
                  channel={channel}
                />
              )
            )
        ) : (
          <div className="loading">Loading messages...</div>
        )}
      </div>
    </div>
  );
}
