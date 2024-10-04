import { Message } from '#/api/chats';

export type MergedMessage = {
  user: number;
  messages: Message[];
  identifier: string;
  minuteString: string;
};
