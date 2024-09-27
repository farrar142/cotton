import NextLink from '#/components/NextLink';
import { useRouter } from '#/hooks/useCRouter';
import useUser from '#/hooks/useUser';
import {
  Bookmark,
  BookmarkBorder,
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
  isSmall: boolean;
}> = ({ url, active, deactive, verbose, isSmall }) => {
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
        width={isSmall ? undefined : '100%'}
        alignItems='center'
      >
        <IconButton size='small' color='inherit'>
          {isCurrentUrl ? (
            <Active fontSize='large' />
          ) : (
            <Deactive fontSize='large' />
          )}
        </IconButton>
        {isSmall || <Typography>{verbose}</Typography>}
      </Stack>
    </NextLink>
  );
};

const LeftSidebar: React.FC<{ openLoginWindow: () => void }> = ({
  openLoginWindow,
}) => {
  const [user] = useUser();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <Stack spacing={2}>
        <NavBarItem
          url='/home'
          verbose='Home'
          active={Home}
          deactive={HomeOutlined}
          isSmall={isSmall}
        />
        <NavBarItem
          url='/search'
          verbose='Search'
          active={SavedSearch}
          deactive={SearchOutlined}
          isSmall={isSmall}
        />
        <NavBarItem
          url='/notification'
          verbose='Notification'
          active={Notifications}
          deactive={NotificationsOutlined}
          isSmall={isSmall}
        />
        {user && (
          <React.Fragment>
            <NavBarItem
              url={`/${user.username}`}
              verbose='Profile'
              active={Person}
              deactive={PersonOutlineOutlined}
              isSmall={isSmall}
            />
            <NavBarItem
              url={`/bookmark`}
              verbose='Bookmark'
              active={Bookmark}
              deactive={BookmarkBorder}
              isSmall={isSmall}
            />
          </React.Fragment>
        )}
      </Stack>
      <Box bottom={0} right={0} mb={3}>
        {user === undefined &&
          (isSmall ? (
            <IconButton>
              <Login />
            </IconButton>
          ) : (
            <Button variant='contained' fullWidth onClick={openLoginWindow}>
              로그인
            </Button>
          ))}
      </Box>
    </Box>
  );
};

export default LeftSidebar;
