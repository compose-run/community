import { useCloudReducer } from "@compose-run/client";
import appName from "./appName";

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

interface MessageDelete {
  type: "MessageDelete";
  messageId: MessageId;
}

type MessagesDB = { [messageId: string]: MessageType };
interface NewMessages {
  type: "NewMessages";
  newMessages: MessagesDB;
}

type MessageAction = MessageCreate | MessageDelete | NewMessages;

export type MessageActionError =
  | false
  | "Unauthorized"
  | "Message does not exist";

const messagesName = `${appName}/messages-test-dict`;

export const useMessages = () =>
  useCloudReducer<MessagesDB, MessageAction, MessageActionError>({
    name: messagesName,
    initialState: {},
    reducer: (messages, action, { resolve, userId }): MessagesDB => {
      if (action.type === "MessageCreate") {
        if (!userId) {
          resolve("Unauthorized");
          return messages;
        }
        const messageId = (Math.random() + 1).toString(36).substring(7);

        resolve(false);
        return {
          ...messages,
          [messageId]: {
            body: action.body,
            sender: userId,
            tags: action.tags,
            replyTo: action.replyTo,
            createdAt: new Date().getTime(),
            id: messageId,
            children: [],
          },
        };
      } else if (action.type === "MessageDelete") {
        const message = messages[action.messageId];
        if (message) {
          if (message.sender === userId) {
            resolve(false);
            return {
              ...messages,
              [action.messageId]: { ...message, deleted: true },
            };
          } else {
            resolve("Unauthorized");
            return messages;
          }
        } else {
          resolve("Message does not exist");
          return messages;
        }
      } else if (action.type === "NewMessages") {
        if (userId === 1 || userId === 2) {
          // only Steve or Adriaan can do this
          resolve(false);
          return { ...action.newMessages };
        } else {
          resolve("Unauthorized");
          return messages;
        }
      }
      return { ...messages };
    },
  }) as [MessagesDB, (action: MessageAction) => Promise<MessageActionError>];
