import { sanitize } from "dompurify";
import { channels, channelColors } from "../App";
import { useMessages, MessageType } from "../state/messages";
import { useUsers } from "../state/users";
import { useState } from "react";
import { useUser } from "@compose-run/client";
import ReplyInput from "./ReplyInput";
import ReplyMessages from "./ReplyMessages";
import { undefinedify } from "../utils";

const marked = require("marked");
var dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Message({
  channel,
  message: {
    body,
    id,
    sender,
    createdAt,
    latestReplyAt,
    tags,
    descendantsCount,
    children,
    deleted,
  },
  style: { borderBottom },
  showRepliesStart = false,
}: {
  channel: string;
  message: MessageType;
  style: { borderBottom: string };
  showRepliesStart?: boolean;
}) {
  const [users] = useUsers();
  const user = useUser();
  const [editing, setEditing] = useState(false);
  const [editingMsg, setEditingMsg] = useState("");
  const [, messageDispatch] = useMessages();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(showRepliesStart);
  const [dispatchingEdit, setDispatchingEdit] = useState(false);
  const [dispatchingDelete, setDispatchingDelete] = useState(false);

  // The tags that are not just the channel name.
  const tagsHere = tags.filter((tag) => tag !== channel);

  function bodyHTML() {
    return { __html: sanitize(marked.parse(body)) };
  }

  const saveMsg = async () => {
    setDispatchingEdit(true);
    await messageDispatch({
      type: "MessageEdit",
      messageId: id,
      body: editingMsg,
    });
    setEditing(false);
    setDispatchingEdit(false);
  };

  if (deleted && !descendantsCount) {
    return <></>;
  }

  const tagsComponent =
    tagsHere.length !== 0 ? (
      <div>
        {tagsHere.map((tag, index) => (
          <div
            key={index}
            style={{
              fontSize: "0.7em",
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
    ) : (
      <></>
    );

  return (
    <div
      style={{
        borderBottom,
        cursor: "default",
      }}
      className={undefinedify(dispatchingDelete) && "loading"}
      onClick={(e) => {
        e.stopPropagation();
        if (!editing) {
          setShowReplies(!showReplies);
        }
      }}
    >
      <div className="group hover:bg-gray-50 pt-2 pb-2 pl-3 pr-3">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            rowGap: "10px",
            columnGap: "5px",
            flexWrap: "wrap",
          }}
        >
          <div>{(users && users[sender].name) || "User " + sender}</div>
          <div style={{ fontSize: "0.7em" }}>{dayjs(createdAt).fromNow()}</div>
          {tagsComponent}
          <div className="hidden group-hover:flex gap-1">
            {undefinedify(user) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplyInput(!showReplyInput);
                  if (!showReplies) {
                    setShowReplies(true);
                  }
                }}
              >
                💬
              </button>
            )}
            {undefinedify(
              user &&
                user.id === sender &&
                !editing &&
                !dispatchingEdit &&
                !dispatchingDelete
            ) && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMsg(body);
                    setEditing(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setDispatchingDelete(true);
                    await messageDispatch({
                      type: "MessageDelete",
                      messageId: id,
                    });
                    setDispatchingDelete(false);
                  }}
                >
                  ❌
                </button>
              </>
            )}
          </div>
        </div>
        {editing || dispatchingEdit ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: "20px",
              alignItems: "right",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            <textarea
              value={editingMsg}
              onChange={(e) => {
                setEditingMsg((e.target as HTMLTextAreaElement).value);
              }}
              onKeyPress={(e) => {
                // TODO - disable for mobile
                if (e.key === "Enter" && !e.shiftKey) {
                  e.stopPropagation();
                  saveMsg();
                }
              }}
              disabled={dispatchingEdit}
              className={dispatchingEdit ? "loading" : ""}
              autoFocus
              onFocus={(e) => {
                let temp = e.target.value;
                e.target.value = "";
                e.target.value = temp;
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: "20px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(false);
                  setEditingMsg("");
                }}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveMsg();
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{ marginTop: 8 }}
            dangerouslySetInnerHTML={deleted ? undefined : bodyHTML()}
          >
            {deleted ? "[message deleted]" : undefined}
          </div>
        )}
        {descendantsCount && !showReplies ? (
          <div style={{ fontSize: "0.7em", marginTop: 8, display: "flex" }}>
            <div style={{ color: "#1c6ba7" }}>
              {descendantsCount || 0} replies
            </div>
            {latestReplyAt && (
              <div style={{ marginLeft: 4, color: "#9a999a" }}>
                Last reply{" "}
                {dayjs(latestReplyAt).fromNow() /* TODO - last reply time */}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      {
        // TODO: Wonky to keep channel around for a "reply"?
      }

      {showReplies && children.length ? (
        <ReplyMessages channel={channel} replyTo={id} />
      ) : (
        <></>
      )}
      {showReplyInput ? (
        <ReplyInput replyTo={id} onReply={() => setShowReplyInput(false)} />
      ) : (
        <></>
      )}
    </div>
  );
}
