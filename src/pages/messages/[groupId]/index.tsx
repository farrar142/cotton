import API from '#/api';
import { MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import CommonLayout from '#/components/layouts/CommonLayout';
import { MessageGroupListViewer } from '#/components/layouts/pages/Messages/MessageGroupListViewer';
import { MessageViewerContainer } from '#/components/layouts/pages/Messages/MessageViewer';
import { getLoginRequiredInitialPropsWrapper } from '#/functions/getInitialPropsWrapper';
import useMediaSize from '#/hooks/useMediaSize';
import { Box } from '@mui/material';
// send_message를 하면
// 웹소켓으로 message오브젝트가 와야됨

const MessageGroupPage: ExtendedNextPage<{
  group: MessageGroup;
  user?: User;
}> = ({ group, user }) => {
  if (!user) throw Error;
  const { isMd, isSmall } = useMediaSize();
  return (
    <Box
      display='flex'
      flexDirection='row'
      width='100%'
      justifyContent='space-evenly'
      pb={isSmall ? 0 : 0}
      paddingBottom={0}
    >
      {!isMd && (
        <Box flex={1}>
          <MessageGroupListViewer me={user} currentGroup={group} />
        </Box>
      )}
      <Box flex={1} position='relative'>
        {/* {isMd && (
          <NextLink
            href={paths.groupMessages}
            sx={{ position: 'absolute', top: '2.5%', left: '5%', zIndex: 5 }}
          >
            <IconButton>
              <ArrowBack />
            </IconButton>
          </NextLink>
        )} */}
        <MessageViewerContainer user={user} group={group} />
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
