import { Channel } from "../App";
import { useMessages, MessageType, MessageId } from "../state/messages";
import Message from "./Message";

export default function Messages({
  channel,
  replyTo,
}: {
  channel: Channel;
  replyTo?: MessageId;
}) {
  const [messages] = useMessages();

  // flex, column-reverse, and extra div trick to make the messages scroll to the bottom
  // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up/21067431#comment79201655_44051405

  // const theseMsgs =
  //   messages
  //   ? (Object.values(messages)
  //     .filter((message) =>
  //       replyTo ? message.replyTo == replyTo
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
        {messages
          ? Object.values(messages)
              .sort(
                (a: MessageType, b: MessageType) => a.createdAt - b.createdAt
              )
              .filter(
                (message: MessageType) =>
                  !message.deleted &&
                  (!replyTo
                    ? // It's the top level messages we want
                      !message.replyTo &&
                      (channel === "all" || message.tags.includes(channel))
                    : // We're listing replies to a message
                      message.replyTo === replyTo)
              )
              .map(
                (
                  message: MessageType,
                  index: number,
                  messagesViewing: MessageType[]
                ) => (
                  <Message
                    style={{
                      borderBottom:
                        index + 1 !== messagesViewing.length
                          ? "1px solid lightgray"
                          : "none",
                    }}
                    key={index}
                    message={message}
                    channel={channel}
                  />
                )
              )
          : "Loading..."}
      </div>
    </div>
  );
}
