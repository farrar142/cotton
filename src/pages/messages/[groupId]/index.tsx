import API from '#/api';
import { MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import CommonLayout from '#/components/layouts/CommonLayout';
import { MessageGroupListViewer } from '#/components/layouts/pages/Messages/MessageGroupListViewer';
import { MessageViewer } from '#/components/layouts/pages/Messages/MessageViewer';
import { getLoginRequiredInitialPropsWrapper } from '#/functions/getInitialPropsWrapper';
import { Box } from '@mui/material';
// send_message를 하면
// 웹소켓으로 message오브젝트가 와야됨

const MessageGroupPage: ExtendedNextPage<{
  group: MessageGroup;
  user?: User;
}> = ({ group, user }) => {
  if (!user) throw Error;
  return (
    <Box
      display='flex'
      flexDirection='row'
      width='100%'
      justifyContent='space-evenly'
      pb={0}
      paddingBottom={0}
    >
      <Box flex={1}>
        <MessageGroupListViewer me={user} />
      </Box>
      <Box flex={1}>
        <MessageViewer user={user} group={group} />
      </Box>
    </Box>
  );
};

MessageGroupPage.getInitialProps = getLoginRequiredInitialPropsWrapper<{
  group: MessageGroup;
}>(async ({ query }) => {
  const groupId = `${query.groupId}`;
  return new Promise((res, rej) => {
    API.Messages.message
      .getItem(groupId)
      .then((r) => r.data)
      .then((group) => res({ group }))
      .catch(() => rej({ error: true, statusCode: 404 }));
  });
});

MessageGroupPage.getLayout = ({ children }) => {
  return <CommonLayout disabledRightPanel>{children}</CommonLayout>;
};

export default MessageGroupPage;
