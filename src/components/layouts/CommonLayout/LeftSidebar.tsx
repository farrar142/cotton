import NextLink from '#/components/NextLink';
import { useRouter } from '#/hooks/useCRouter';
import { usePostWrite } from '#/hooks/usePostWrite';
import useUser from '#/hooks/useUser';
import paths from '#/paths';
import {
  Bookmark,
  BookmarkBorder,
  Create,
  Email,
  EmailOutlined,
  ExitToApp,
  Home,
  HomeOutlined,
  Login,
  Notifications,
  NotificationsOutlined,
  Person,
  PersonOutlineOutlined,
  SavedSearch,
  SearchOutlined,
  SvgIconComponent,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import {
  useInComingMessages,
  useUnreadedMessagesCount,
} from '../pages/Messages/MessageGroupAtom';
import API from '#/api';
import useValue from '#/hooks/useValue';
import { User } from '#/api/users/types';
import useMediaSize from '#/hooks/useMediaSize';
import { useUnCheckedNotification } from '../pages/Notifications/NotificationAtom';

const NavBarItem: React.FC<{
  url: string;
  verbose: string;
  active: SvgIconComponent;
  deactive: SvgIconComponent;
  isMd: boolean;
  badge?: number;
}> = ({ url, active, deactive, verbose, isMd, badge }) => {
  const theme = useTheme();
  const router = useRouter();
  const isCurrentUrl = useMemo(() => {
    return router.asPath.startsWith(url);
  }, [router.asPath, url]);
  const Active = active;
  const Deactive = deactive;
  const icon = useMemo(
    () =>
      isCurrentUrl ? (
        <Active fontSize='large' />
      ) : (
        <Deactive fontSize='large' />
      ),
    [isCurrentUrl]
  );
  return (
    <NextLink
      href={url}
      color='textPrimary'
      sx={{
        ':hover': {
          color: theme.palette.info.light,
        },
      }}
    >
      <Stack
        direction='row'
        width={isMd ? undefined : '100%'}
        alignItems='center'
        color={isCurrentUrl ? 'primary.main' : 'info.main'}
      >
        <IconButton size='small' color='inherit'>
          {badge ? (
            <Badge
              badgeContent={badge}
              variant={badge === 1 ? 'dot' : undefined}
              color='primary'
            >
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </IconButton>
        {!isMd ? <Typography>{verbose}</Typography> : <></>}
      </Stack>
    </NextLink>
  );
};

const MessageNavItem: React.FC<{ user: User }> = ({ user }) => {
  const { isMd, isSmall } = useMediaSize();
  const unreaded = useUnreadedMessagesCount(user);
  return (
    <NavBarItem
      url='/messages'
      verbose='Messages'
      active={Email}
      deactive={EmailOutlined}
      isMd={isMd}
      badge={unreaded.count}
    />
  );
};
const NotificationNavItem: React.FC<{ user: User }> = ({ user }) => {
  const { isMd, isSmall } = useMediaSize();
  const { count } = useUnCheckedNotification(user);
  return (
    <NavBarItem
      url='/notification'
      verbose='Notification'
      active={Notifications}
      deactive={NotificationsOutlined}
      isMd={isMd}
      badge={count}
    />
  );
};

const LeftSidebar: React.FC<{ openLoginWindow: () => void }> = ({
  openLoginWindow,
}) => {
  const [user, _, signout] = useUser();
  const { isMd, isSmall } = useMediaSize();
  const [isWrite, setIsWrite] = usePostWrite();
  return (
    <Box
      position='relative'
      height={isSmall ? undefined : '100%'}
      width={isSmall ? '100%' : undefined}
      display='flex'
      flexDirection={isSmall ? 'row' : 'column'}
      justifyContent={isSmall ? undefined : 'space-between'}
    >
      <Stack
        spacing={2}
        flex={isSmall ? 1 : undefined}
        direction={isSmall ? 'row' : 'column'}
        height={isMd ? '100%' : undefined}
        width={isSmall ? undefined : '100%'}
        justifyContent={isSmall ? 'space-evenly' : undefined}
      >
        <NavBarItem
          url='/home'
          verbose='Home'
          active={Home}
          deactive={HomeOutlined}
          isMd={isMd}
        />
        <NavBarItem
          url='/search'
          verbose='Search'
          active={SavedSearch}
          deactive={SearchOutlined}
          isMd={isMd}
        />
        {user && (
          <React.Fragment>
            <NotificationNavItem user={user} />
            <MessageNavItem user={user} />
            <NavBarItem
              url={paths.mypage(user.username)}
              verbose='Profile'
              active={Person}
              deactive={PersonOutlineOutlined}
              isMd={isMd}
            />
            <NavBarItem
              url={`/bookmark`}
              verbose='Bookmark'
              active={Bookmark}
              deactive={BookmarkBorder}
              isMd={isMd}
            />
            <Box
              onClick={() => setIsWrite({ open: true })}
              display='flex'
              alignItems='center'
              justifyContent={isMd ? 'center' : undefined}
            >
              {isMd ? (
                <IconButton>
                  <Create />
                </IconButton>
              ) : (
                <Button variant='contained' fullWidth color='info'>
                  Post
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Stack>
      {isSmall ? (
        <></>
      ) : (
        <Tooltip title={Boolean(user) ? 'Logout' : 'Login'}>
          <Box bottom={0} right={0} mb={isSmall ? undefined : 3}>
            {!Boolean(user) ? (
              isMd ? (
                <IconButton onClick={openLoginWindow}>
                  <Login />
                </IconButton>
              ) : (
                <Button variant='contained' fullWidth onClick={openLoginWindow}>
                  Login
                </Button>
              )
            ) : isMd ? (
              <IconButton onClick={signout} color='warning'>
                <ExitToApp />
              </IconButton>
            ) : (
              <Button
                variant='contained'
                color='inherit'
                fullWidth
                onClick={signout}
              >
                Logout
              </Button>
            )}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default LeftSidebar;
