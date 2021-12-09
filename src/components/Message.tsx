import { sanitize } from "dompurify";
import { channels, channelColors } from "../App";
import { MessageType } from "../state/messages";
import { useUsers } from "../state/users";

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
  const [users] = useUsers();
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
        <b>{(users && users[sender]) || "User " + sender}</b>
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
      <div style={{ marginTop: 8 }} dangerouslySetInnerHTML={bodyHTML()}></div>
      <div style={{ fontSize: "0.7em", marginTop: 8, display: "flex" }}>
        <div style={{ color: "#1c6ba7" }} /* TODO onClick */>
          {0 /* TODO - count replies */} replies
        </div>
        <div style={{ marginLeft: 4, color: "#9a999a" }}>
          Last reply {dayjs(createdAt).fromNow() /* TODO - last reply time */}
        </div>
      </div>
    </div>
  );
}
