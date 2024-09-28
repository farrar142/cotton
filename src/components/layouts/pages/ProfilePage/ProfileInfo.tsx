import { RegisteredUser, User } from '#/api/users/types';
import { CalendarMonth } from '@mui/icons-material';
import { Box, Avatar, Button, Stack, Typography } from '@mui/material';
import moment from 'moment';

const ProfileInfo: React.FC<{ profile: RegisteredUser }> = ({ profile }) => {
  return (
    <Box>
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
    </Box>
  );
};

export default ProfileInfo;
