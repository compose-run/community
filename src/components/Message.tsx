import { sanitize } from "dompurify";
import { channels, channelColors } from "../App";
import { useMessages, MessageType } from "../state/messages";
import { useUsers } from "../state/users";
import { useState } from "react";

const marked = require("marked");
var dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Message({
  channel,
  message: { body, id, sender, createdAt, replyTo, tags },
  style: { borderBottom },
}: {
  channel: string;
  message: MessageType;
  style: { borderBottom: string };
}) {
  const [users] = useUsers();
  const [editing, setEditing] = useState(false);
  const [editingMsg, setEditingMsg] = useState("");
  const [, messageDispatch] = useMessages();
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
      {editing ? (
        // TODO: put MessageEdit action here
        <button
          onClick={() => {
            setEditing(false);
            // TODO: resolve edit message promise
            messageDispatch({
              type: "MessageEdit",
              messageId: id,
              body: editingMsg,
            });
            setEditingMsg("");
          }}
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => {
            setEditingMsg(body);
            setEditing(true);
          }}
        >
          Edit
        </button>
      )}
      <button
        onClick={() =>
          messageDispatch({ type: "MessageDelete", messageId: id })
        }
      >
        Delete
      </button>
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
      {editing ? (
        <textarea
          value={editingMsg}
          onChange={(e) => {
            setEditingMsg((e.target as HTMLTextAreaElement).value);
          }}
        ></textarea>
      ) : (
        <div
          style={{ marginTop: 8 }}
          dangerouslySetInnerHTML={bodyHTML()}
        ></div>
      )}
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
