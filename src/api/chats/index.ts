import {
  GenericAPI,
  Paginated,
  SimpleResponse,
  TimeLinePaginated,
} from '../general';
import { User } from '../users/types';

export type MessageGroupUpsert = {
  users: number[];
  is_direct_message: boolean;
};

export type MessageGroup = {
  id: number;
  title?: string;
  is_direct_message: boolean;
  attendants: User[];
  inComingMessages?: Message[];
  unreaded_messages: number;
} & (
  | {
      latest_message: string;
      latest_message_user: number;
      latest_message_nickname: string;
      latest_message_created_at: string;
    }
  | { latest_message: undefined; latest_message_created_at: undefined }
);

export type Message = {
  id: number;
  group: number;
  user: number;
  nickname: string;
  created_at: string;
  message: string;
  identifier: string;
  has_checked: boolean;
};

class MessageAPIGenerator extends GenericAPI<
  MessageGroup,
  MessageGroupUpsert,
  {},
  TimeLinePaginated<MessageGroup>
> {
  create = (data: { users: number[]; is_direct_message: boolean }) => {
    const endpoint = this.getEndpoint('/create/');
    return this.client.post<MessageGroup>(endpoint, data);
  };
  changeTitle = (id: number | string, title: string) => {
    const endpoint = this.getEndpoint(`/${id}/change_title/`);
    return this.client.patch<SimpleResponse>(endpoint, { title });
  };
  sendMessage = (id: number | string, message: string, identifier: string) => {
    const endpoint = this.getEndpoint(`/${id}/send_message/`);
    return this.client.post<{ is_success: boolean }>(endpoint, {
      message,
      identifier,
    });
  };
  getMessages = (id: number | string) => {
    const endpoint = this.getEndpoint(`/${id}/messages/`);
    return this.getItemsRequest<Message, {}, Paginated<Message>>(endpoint);
  };
  checkMessages = (groupId: number | string) => {
    const endpoint = this.getEndpoint(`/${groupId}/check_as_readed/`);
    return this.client.post<SimpleResponse>(endpoint);
  };
  getHasUnreadedMessages = () => {
    const endpoint = this.getEndpoint(`/has_unreaded_messages/`);
    return this.client.get<{ count: number }>(endpoint);
  };
}

export const Messages = {
  message: new MessageAPIGenerator('/message_groups'),
};
