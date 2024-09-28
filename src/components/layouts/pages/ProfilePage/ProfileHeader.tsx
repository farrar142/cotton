import API from '#/api';
import { RegisteredUser, User } from '#/api/users/types';
import { PostTimeline } from '#/components/timelines';
import { useRouter } from '#/hooks/useCRouter';
import { glassmorphism } from '#/styles';
import { ArrowBack, CalendarMonth } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import moment from 'moment';

export const ProfileHeader: React.FC<{
  profile: RegisteredUser;
  postCount: number;
}> = ({ profile, postCount }) => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <Box position='sticky' top={0} sx={{ ...glassmorphism(theme), zIndex: 10 }}>
      <Stack spacing={1} direction='row' p={1} alignItems='center'>
        <Tooltip title='Back to History' onClick={() => router.back}>
          <Box>
            <IconButton onClick={router.back}>
              <ArrowBack />
            </IconButton>
          </Box>
        </Tooltip>
        <Stack>
          <Typography variant='h6'>{profile.nickname}</Typography>
          <Typography variant='caption' color='textDisabled'>
            {Intl.NumberFormat('ko-KR').format(postCount)} 게시물
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
export default ProfileHeader;
