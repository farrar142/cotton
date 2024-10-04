import API from '#/api';
import { MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import CommonLayout from '#/components/layouts/CommonLayout';
import { MessageGroupListViewer } from '#/components/layouts/pages/Messages/MessageGroupListViewer';
import { MessageViewer } from '#/components/layouts/pages/Messages/MessageViewer';
import NextLink from '#/components/NextLink';
import { getLoginRequiredInitialPropsWrapper } from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import useMediaSize from '#/hooks/useMediaSize';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useEffect } from 'react';
// send_message를 하면
// 웹소켓으로 message오브젝트가 와야됨

const MessageGroupPage: ExtendedNextPage<{
  group: MessageGroup;
  user?: User;
}> = ({ group, user }) => {
  if (!user) throw Error;
  const { isMd } = useMediaSize();
  return (
    <Box
      display='flex'
      flexDirection='row'
      width='100%'
      justifyContent='space-evenly'
      pb={0}
      paddingBottom={0}
    >
      {!isMd && (
        <Box flex={1}>
          <MessageGroupListViewer me={user} currentGroup={group} />
        </Box>
      )}
      <Box flex={1} position='relative'>
        {isMd && (
          <NextLink
            href={paths.groupMessages}
            sx={{ position: 'absolute', top: '2.5%', left: '5%', zIndex: 5 }}
          >
            <IconButton>
              <ArrowBack />
            </IconButton>
          </NextLink>
        )}
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
