import API from '#/api';
import { User } from '#/api/users/types';
import { PostTimeline } from '#/components/timelines';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import useValue from '#/hooks/useValue';
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
import { useEffect } from 'react';
const ProfilePage: ExtendedNextPage<{ profile: User }> = ({ profile }) => {
  const router = useRouter();
  const theme = useTheme();
  const postCount = useValue(0);
  useEffect(() => {
    API.Posts.post
      .getCount({ username: profile.username })
      .then(({ data }) => data.count)
      .then(postCount.set);
  }, []);
  if (!profile.is_registered) return <></>;
  console.log(profile);
  return (
    <Box
      sx={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'divider' }}
    >
      <Box
        position='sticky'
        top={0}
        sx={{ ...glassmorphism(theme), zIndex: 10 }}
      >
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
              {Intl.NumberFormat('ko-KR').format(postCount.get)} 게시물
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {/**헤더 칸 */}
      <img
        src='https://pbs.twimg.com/media/GYeKYhxbwAAMFX0?format=png&name=360x360'
        alt=''
        style={{ width: '100%', aspectRatio: 3, objectFit: 'cover' }}
      />
      {/**프로필 이미지 칸 */}
      <Box display='flex' flexDirection='row' position='relative' pb={3}>
        <Box
          sx={{
            width: '22%',
            maxWidth: '22%',
            aspectRatio: '1',
            ml: 2,
            left: 0,
            position: 'absolute',
            top: '-110%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: 'background.default',
              borderRadius: 125,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar sx={{ width: '95%', height: '95%' }} />
          </Box>
        </Box>
        <Box flex={1} />
        <Box pt={1} pr={1.5}>
          <Button variant='outlined' color='inherit' sx={{ borderRadius: 15 }}>
            프로필 수정
          </Button>
        </Box>
      </Box>
      {/**프로필 정보 칸 */}
      <Stack px={2}>
        <Typography variant='h5' fontWeight='bold'>
          {profile.username}
        </Typography>
        <Typography variant='caption' color='textDisabled'>
          @{profile.username}
        </Typography>
        {/**유저 바이오 */}
        <Typography variant='body1' pt={1} whiteSpace='pre-line'>
          {profile.bio}
        </Typography>

        <Stack direction='row' spacing={1} alignItems='center' py={2}>
          <CalendarMonth color='disabled' fontSize='small' />
          <Typography color='textDisabled' variant='body2'>
            가입일 : {moment(profile.registered_at).format('YYYY년 MM월')}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={2}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <Typography variant='subtitle2' fontWeight={700}>
              {profile.followings_count}
            </Typography>
            <Typography
              variant='subtitle2'
              fontWeight={100}
              color='textDisabled'
            >
              팔로우 중
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1}>
            <Typography variant='subtitle2' fontWeight={700}>
              {profile.followers_count}
            </Typography>
            <Typography
              variant='subtitle2'
              fontWeight={100}
              color='textDisabled'
            >
              팔로워
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <PostTimeline
        getter={API.Posts.post.getUserTimeline(profile.username)}
        type={profile.username}
      />
    </Box>
  );
};
ProfilePage.getInitialProps = getInitialPropsWrapper(async ({ query }) => {
  return new Promise((res, rej) => {
    const username = `${query.username}`;
    API.Relations.getUserByUsername(username)
      .then(({ data }) => ({ profile: data }))
      .then(res)
      //@ts-ignore
      .catch(() => res({ error: true, statusCode: 404 }));
  });
});
export default ProfilePage;
