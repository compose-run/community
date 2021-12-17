import { Channel } from "../App";
import { useMessages, MessageType, MessageId } from "../state/messages";
import Message from "./Message";

export default function ReplyMessages({
  channel,
  replyTo,
}: {
  channel: Channel;
  replyTo?: MessageId;
}) {
  const [messages] = useMessages();

  // flex, column-reverse, and extra div trick to make the messages scroll to the bottom
  // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up/21067431#comment79201655_44051405

  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column-reverse",
        paddingLeft: 20,
      }}
    >
      <div>
        {messages
          ? Object.values(messages)
              .filter((message: MessageType) => message.replyTo === replyTo)
              .sort(
                (a: MessageType, b: MessageType) => a.createdAt - b.createdAt
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
                    showRepliesStart={true}
                  />
                )
              )
          : "Loading..."}
      </div>
    </div>
  );
}
