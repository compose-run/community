import { useCloudReducer } from "../compose-client-dist/module";
import appName from "./appName";

export type MessageId = string;

export interface MessageType {
  createdAt: number;
  body: string;
  sender: string;
  id: MessageId;
  replyTo: MessageId;
  tags: string[];
}

interface MessageCreate {
  type: "MessageCreate";
  body: string;
  sender: string;
  replyTo?: MessageId;
  tags: string[];
}

interface MessageDelete {
  type: "MessageDelete";
  messageId: MessageId;
}

interface NewMessages {
  type: "NewMessages";
  newMessages: MessageType[];
}

type MessageAction = MessageCreate | MessageDelete | NewMessages;

type MessageActionError = false | "Unauthorized" | "Message does not exist";

const messagesName = `${appName}/messages`;

export const useMessages = () =>
  useCloudReducer({
    name: messagesName,
    initialState: [],
    reducer: (
      messages: MessageType[],
      action: MessageAction,
      {
        resolve,
        userId,
      }: { resolve: (e: MessageActionError) => void; userId: number }
    ) => {
      if (action.type === "MessageCreate") {
        // if (action.message.sender === action.context.userId) {

        // very curiously, if you use messages.push here, it adds the message 3x
        return [
          ...messages,
          {
            body: action.body,
            sender: action.sender,
            tags: action.tags,
            replyTo: action.replyTo,
            createdAt: new Date().getTime(),
            id: (Math.random() + 1).toString(36).substring(7),
          },
        ];
        // } else {
        //  resolve ("Unauthorized")
        // }
      } else if (action.type === "MessageDelete") {
        const message = messages.find(
          ({ sender }) => sender === action.messageId
        );
        if (message) {
          // if (action.message.sender === action.context.userId) {
          messages = messages.filter(
            ({ sender }) => sender !== action.messageId
          );
          resolve(false);
          // } else {
          //  resolve ("Unauthorized")
          // }
        } else {
          resolve("Message does not exist");
        }
      } else if (action.type === "NewMessages") {
        // TODO - only let admins do this
        return [...action.newMessages];
      }
    },
  });
