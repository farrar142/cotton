import API from '#/api';
import { ImageType } from '#/api/commons/types';
import { RegisteredUser, User } from '#/api/users/types';
import TextInput from '#/components/inputs/TextInput';
import { ScrollPreventedBackdrop } from '#/components/utils/ScrollPreventedBackdrop';
import { useNestedState } from '#/hooks/useNestedState';
import useUser from '#/hooks/useUser';
import useValue, { UseValue } from '#/hooks/useValue';
import { glassmorphism } from '#/styles';
import { getBase64 } from '#/utils/images/getBase64';
import { AddAPhoto, CalendarMonth, Close } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import { ChangeEventHandler, createRef, useRef } from 'react';
import { atomFamily, DefaultValue, selectorFamily } from 'recoil';

const HiddenInput = styled('input')({
  display: 'none',
  visibility: 'hidden',
});

const ProfileEditor: React.FC<{ open: UseValue<boolean> }> = ({ open }) => {
  const [user, setUser] = useUser();
  const theme = useTheme();
  const profileRef = createRef<HTMLInputElement>();
  const headerRef = createRef<HTMLInputElement>();
  if (!user) return <></>;
  //텍스트 값
  const nickname = useValue(user.nickname);
  const bio = useValue(user.bio);
  //이미지 값
  const headerImage = useValue(user.header_image);
  const profileImage = useValue(user.profile_image);

  const currentSetter = useRef(headerImage);
  const ratio = useValue(1);
  const editImage = useValue<ImageType | undefined>(undefined);

  const closeEditor = () => open.set(false);

  const onImageChange =
    (
      state: UseValue<ImageType | undefined>,
      aspectRatio: number
    ): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const file = [...(e.target.files || [])][0];
      if (!file) return;
      getBase64(file)
        .then((url) => {
          currentSetter.current = state;
          editImage.set({ id: -1, url });
          ratio.set(aspectRatio);
        })
        .finally(() => (e.target.value = ''));
    };

  return (
    <ScrollPreventedBackdrop open={open.get} onClick={closeEditor}>
      <Box width='100%' height='100%' display='flex'>
        {/**상단 */}
        <Box
          m='auto'
          maxWidth={(theme) => theme.breakpoints.values.sm}
          width={(theme) => theme.breakpoints.values.sm}
          bgcolor='background.default'
          p={1}
          borderRadius={5}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/**프로필 에디터 */}
          {editImage.get ? (
            <></>
          ) : (
            <Stack spacing={1}>
              <HiddenInput
                type='file'
                accept='image/png, image/gif, image/jpeg'
                ref={profileRef}
                onChange={onImageChange(profileImage, 1)}
              />
              <HiddenInput
                type='file'
                accept='image/png, image/gif, image/jpeg'
                ref={headerRef}
                onChange={onImageChange(headerImage, 3)}
              />
              <Stack direction='row' alignItems='center'>
                <IconButton onClick={closeEditor}>
                  <Close />
                </IconButton>
                <Box flex={1}>
                  <Typography>프로필 수정</Typography>
                </Box>
                <Button>저장</Button>
              </Stack>
              {/**헤더 이미지 */}
              <Box position='relative' sx={{ width: '100%', aspectRatio: 3 }}>
                <img
                  src={headerImage.get?.url}
                  alt=''
                  style={{ width: '100%', aspectRatio: 3, objectFit: 'cover' }}
                />
                <Stack
                  spacing={2}
                  direction='row'
                  position='absolute'
                  top={'50%'}
                  left={'50%'}
                  sx={{ transform: 'translate(-50%, -50%)' }}
                >
                  <IconButton
                    sx={glassmorphism(theme)}
                    onClick={() => {
                      headerRef.current?.click();
                    }}
                  >
                    <AddAPhoto />
                  </IconButton>
                  <IconButton
                    sx={glassmorphism(theme)}
                    onClick={() => {
                      headerImage.set(undefined);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
                {/**프로필 이미지 */}
                <Box
                  sx={{
                    width: '22%',
                    maxWidth: '22%',
                    aspectRatio: '1',
                    ml: 2,
                    left: 0,
                    position: 'absolute',
                    top: '65%',
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
                    <Avatar
                      sx={{ width: '95%', height: '95%' }}
                      src={profileImage.get?.url}
                    />
                    <Box
                      position='absolute'
                      top={'50%'}
                      left={'50%'}
                      sx={{ transform: 'translate(-50%, -50%)' }}
                    >
                      <IconButton
                        sx={glassmorphism(theme)}
                        onClick={() => {
                          profileRef.current?.click();
                        }}
                      >
                        <AddAPhoto />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box width='100%' position='relative' pt={7}></Box>
              <TextInput
                label='Nickname'
                size='small'
                value={nickname.get}
                onChange={nickname.onTextChange}
              />
              <TextInput
                label='Bio'
                size='small'
                value={bio.get}
                onChange={bio.onTextChange}
              />
            </Stack>
          )}
          {/**미디어 에디터 */}
          {editImage.get ? (
            <Stack spacing={1}>
              <Stack direction='row' alignItems='center'>
                <IconButton onClick={closeEditor}>
                  <Close />
                </IconButton>
                <Box flex={1}>
                  <Typography>미디어 수정</Typography>
                </Box>
                <Button>저장</Button>
              </Stack>
              <Box
                sx={{ width: '100%', aspectRatio: 1, p: 3, overflow: 'hidden' }}
              >
                <img src={editImage.get.url} alt='' />
                <Box border='1px solid red' width='100%' height='100%'></Box>
              </Box>
            </Stack>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </ScrollPreventedBackdrop>
  );
};

const ProfileInfo: React.FC<{ profile: RegisteredUser }> = ({ profile }) => {
  const profileEditorOpen = useValue(false);
  return (
    <Box>
      <ProfileEditor open={profileEditorOpen} />
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
          <Button
            variant='outlined'
            color='inherit'
            onClick={() => profileEditorOpen.set(true)}
            sx={{ borderRadius: 15 }}
          >
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
