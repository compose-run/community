import { useCloudReducer } from "@compose-run/client";
import { appName, getPreviousState } from "./appName";

export type MessageId = string;
export interface MessageType {
  createdAt: number;
  body: string;
  sender: number;
  id: MessageId;
  replyTo?: MessageId;
  tags: string[];
  children: MessageId[];
  deleted?: boolean;
}

interface MessageCreate {
  type: "MessageCreate";
  body: string;
  sender: number;
  replyTo?: MessageId;
  tags: string[];
}

interface MessageEdit {
  type: "MessageEdit";
  body?: string;
  messageId: MessageId;
  tags?: string[];
}

interface MessageDelete {
  type: "MessageDelete";
  messageId: MessageId;
}

type MessagesDB = { [messageId: string]: MessageType };
interface NewMessages {
  type: "NewMessages";
  newMessages: MessagesDB;
}

type MessageAction = MessageCreate | MessageEdit | MessageDelete | NewMessages;

export type MessageActionError =
  | false
  | "Unauthorized"
  | "Message does not exist";

const messages = "messages";

export const useMessages = () =>
  useCloudReducer<MessagesDB, MessageAction, MessageActionError>({
    name: `${appName}/${messages}`,
    initialState: getPreviousState(messages, {}),
    reducer: (messages, action, { resolve, userId }): MessagesDB => {
      if (action.type === "MessageCreate") {
        if (!userId) {
          resolve("Unauthorized");
          return messages;
        }
        // TODO: Better identifiers (UUID/...).
        const messageId = (Math.random() + 1).toString(36).substring(7);

        if (action.replyTo) {
          if (messages[action.replyTo]) {
            messages[action.replyTo].children.push(messageId);
          }
        }
        messages[messageId] = {
          body: action.body,
          sender: userId,
          tags: action.tags,
          replyTo: action.replyTo,
          createdAt: new Date().getTime(),
          id: messageId,
          children: [],
        };
        resolve(false);
      } else if (action.type === "MessageEdit") {
        const message = messages[action.messageId];
        if (message) {
          if (message.sender === userId) {
            resolve(false);
            if (action.body) {
              messages[action.messageId].body = action.body;
            }
            if (action.tags) {
              messages[action.messageId].tags = action.tags;
            }
          } else {
            resolve("Unauthorized");
          }
        } else {
          resolve("Message does not exist");
        }
      } else if (action.type === "MessageDelete") {
        const message = messages[action.messageId];
        if (message) {
          if (message.sender === userId) {
            resolve(false);
            messages[action.messageId].deleted = true;
          } else {
            resolve("Unauthorized");
          }
        } else {
          resolve("Message does not exist");
        }
      } else if (action.type === "NewMessages") {
        if (userId === 1 || userId === 2) {
          // only Steve or Adriaan can do this
          resolve(false);
          return action.newMessages;
        } else {
          resolve("Unauthorized");
        }
      }
      return messages;
    },
  });
