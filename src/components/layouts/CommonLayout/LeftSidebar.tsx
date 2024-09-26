import { useRouter } from '#/hooks/useCRouter';
import useUser from '#/hooks/useUser';
import {
  Home,
  HomeOutlined,
  Notifications,
  NotificationsOutlined,
  Person,
  PersonOutlineOutlined,
  Search,
  SearchOutlined,
  SvgIconComponent,
} from '@mui/icons-material';
import { Box, IconButton, Stack } from '@mui/material';
import { useMemo } from 'react';

const NavBarItem: React.FC<{
  url: string;
  verbose: string;
  active: SvgIconComponent;
  deactive: SvgIconComponent;
}> = ({ url, active, deactive }) => {
  const router = useRouter();
  const isCurrentUrl = useMemo(() => {
    return router.pathname.startsWith(url);
  }, [router.pathname, url]);
  const Active = active;
  const Deactive = deactive;
  return (
    <Box>
      <IconButton size='small'>
        {isCurrentUrl ? (
          <Active fontSize='large' />
        ) : (
          <Deactive fontSize='large' />
        )}
      </IconButton>
    </Box>
  );
};

const LeftSidebar: React.FC = () => {
  const [user] = useUser();
  return (
    <Stack spacing={1} alignItems='center'>
      <NavBarItem
        url='/home'
        verbose='Home'
        active={Home}
        deactive={HomeOutlined}
      />
      <NavBarItem
        url='/search'
        verbose='Search'
        active={Search}
        deactive={SearchOutlined}
      />
      <NavBarItem
        url='/notification'
        verbose='Notification'
        active={Notifications}
        deactive={NotificationsOutlined}
      />
      {user && (
        <NavBarItem
          url={`/${user.username}`}
          verbose='Profile'
          active={Person}
          deactive={PersonOutlineOutlined}
        />
      )}
    </Stack>
  );
};

export default LeftSidebar;
