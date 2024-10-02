import NextLink from '#/components/NextLink';
import { useRouter } from '#/hooks/useCRouter';
import { usePostWrite } from '#/hooks/usePostWrite';
import useUser from '#/hooks/useUser';
import paths from '#/paths';
import {
  Bookmark,
  BookmarkBorder,
  Create,
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
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useMemo } from 'react';

const NavBarItem: React.FC<{
  url: string;
  verbose: string;
  active: SvgIconComponent;
  deactive: SvgIconComponent;
  isMd: boolean;
}> = ({ url, active, deactive, verbose, isMd }) => {
  const theme = useTheme();
  const router = useRouter();
  const isCurrentUrl = useMemo(() => {
    return router.asPath.startsWith(url);
  }, [router.asPath, url]);
  const Active = active;
  const Deactive = deactive;
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
          {isCurrentUrl ? (
            <Active fontSize='large' />
          ) : (
            <Deactive fontSize='large' />
          )}
        </IconButton>
        {!isMd ? <Typography>{verbose}</Typography> : <></>}
      </Stack>
    </NextLink>
  );
};

const LeftSidebar: React.FC<{ openLoginWindow: () => void }> = ({
  openLoginWindow,
}) => {
  const router = useRouter();
  const [user, _, signout] = useUser();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
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
        <NavBarItem
          url='/notification'
          verbose='Notification'
          active={Notifications}
          deactive={NotificationsOutlined}
          isMd={isMd}
        />
        {user && (
          <React.Fragment>
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
                  게시하기
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
