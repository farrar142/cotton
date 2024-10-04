import API from '#/api';
import { MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import { MessageViewer } from '#/components/layouts/pages/Messages/MessageViewer';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { LoginRequired } from '#/functions/getInitialPropsWrapper/middleware';
// send_message를 하면
// 웹소켓으로 message오브젝트가 와야됨

const MessageGroupPage: ExtendedNextPage<{
  group: MessageGroup;
  user?: User;
}> = ({ group, user }) => {
  if (!user) throw Error;
  return <MessageViewer user={user} group={group} />;
};

MessageGroupPage.getInitialProps = getInitialPropsWrapper<{
  group: MessageGroup;
}>(
  async ({ query }) => {
    const groupId = `${query.groupId}`;
    return new Promise((res, rej) => {
      API.Messages.message
        .getItem(groupId)
        .then((r) => r.data)
        .then((group) => res({ group }))
        .catch(() => rej({ error: true, statusCode: 404 }));
    });
  }
  // {
  //   pre: [LoginRequired],
  // }
);

export default MessageGroupPage;
