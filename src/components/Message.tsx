import { sanitize } from "dompurify";
import { channels, channelColors } from "../App";
import { MessageType } from "../state/messages";
const marked = require("marked");
var dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Message({
  channel,
  message: { body, sender, createdAt, replyTo, tags },
  style: { borderBottom },
}: {
  channel: string;
  message: MessageType;
  style: { borderBottom: string };
}) {
  // TODO - lookup name & profile pic from sender id

  function bodyHTML() {
    return { __html: sanitize(marked.parse(body)) };
  }

  return (
    <div
      style={{
        paddingBottom: 10,
        paddingTop: 10,
        borderBottom,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <b>{sender}</b>
        <div style={{ fontSize: "0.7em", marginLeft: 4 }}>
          {dayjs(createdAt).fromNow()}
        </div>
        <div>
          {tags
            .filter((tag) => tag !== channel)
            .map((tag, index) => (
              <div
                key={index}
                style={{
                  fontSize: "0.7em",
                  marginLeft: 4,
                  padding: 2,
                  fontFamily: "monospace",
                  backgroundColor: channelColors[channels.indexOf(tag)],
                  borderRadius: 5,
                }}
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
      <div dangerouslySetInnerHTML={bodyHTML()}></div>
    </div>
  );
}
