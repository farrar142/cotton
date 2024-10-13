import API from '#/api';
import { ImageType } from '#/api/commons/types';
import { RegisteredUser, User } from '#/api/users/types';
import TextInput from '#/components/inputs/TextInput';
import { ScrollPreventedBackdrop } from '#/components/utils/ScrollPreventedBackdrop';
import { useRouter } from '#/hooks/useCRouter';
import useMediaSize from '#/hooks/useMediaSize';
import { usePromiseState } from '#/hooks/usePromiseState';
import useUser, { useUserProfile } from '#/hooks/useUser';
import useValue, { UseValue } from '#/hooks/useValue';
import paths from '#/paths';
import { glassmorphism } from '#/styles';
import { getBase64 } from '#/utils/images/getBase64';
import {
  AddAPhoto,
  CalendarMonth,
  Close,
  Email,
  Lock,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  styled,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import React, { ChangeEventHandler, createRef, useMemo, useRef } from 'react';
import { ProfileFollowInfo } from './ProfileFollowInfo';

const HiddenInput = styled('input')({
  display: 'none',
  visibility: 'hidden',
});

const ProfileEditor: React.FC<{ open: UseValue<boolean> }> = ({ open }) => {
  const [user, setUser] = useUser();
  const router = useRouter();
  const theme = useTheme();
  const isUploading = useValue(false);
  if (!user) return <></>;
  //텍스트 값
  const nickname = useValue(user.nickname);
  const username = useValue(user.username);
  const is_protected = useValue(user.is_protected || false);
  const bio = useValue(user.bio);
  //이미지 값
  const profileRef = createRef<HTMLInputElement>();
  const headerRef = createRef<HTMLInputElement>();

  const headerImage = useValue(user.header_image);
  const profileImage = useValue(user.profile_image);

  const newHeaderImage = useValue<ImageType | undefined>(undefined);
  const newProfileImage = useValue<ImageType | undefined>(undefined);

  const currentSetter = useRef(headerImage);
  const ratio = useValue(1);
  const editImage = useValue<ImageType | undefined>(undefined);
  const size = useValue({ width: 100, height: 100 });

  const dragStart = useRef(false);
  const prevPos = useRef({ x: 0, y: 0 });
  const translate = useValue({ x: 0, y: 0 });

  const closeEditor = () => {
    open.set(false);
    editImage.set(undefined);
  };

  const onImageChange =
    (
      state: UseValue<ImageType | undefined>,
      aspectRatio: number
    ): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const file = [...(e.target.files || [])][0];
      if (!file) return;
      getBase64(file).then((url) => state.set({ id: -1, url }));
      // const fileUrl = URL.createObjectURL(file);
      // getImageSize(fileUrl)
      //   .then(({ url, ...imgSize }) => {
      //     currentSetter.current = state;
      //     size.set(imgSize);
      //     editImage.set({ id: -1, url });
      //     ratio.set(aspectRatio);
      //   })
      //   .finally(() => (e.target.value = ''));
    };

  const onPost = () => {
    const params = {
      nickname: nickname.get,
      bio: bio.get,
      profile_image: newProfileImage.get,
      header_image: newHeaderImage.get,
      username: username.get,
      is_protected: is_protected.get,
    };
    const filtered = Object.entries(params).filter(
      ([key, value]) => value !== undefined
    );
    const merged = Object.fromEntries(filtered);
    isUploading.set(true);
    API.Users.patchItem(user.id, merged)
      .then((r) => r.data)
      .then(setUser)
      .then(() => {
        if (newProfileImage.get) profileImage.set(newProfileImage.get);
        if (newHeaderImage.get) headerImage.set(newHeaderImage.get);
        newProfileImage.set(undefined);
        headerImage.set(undefined);
      })
      .then(() => {
        if (user.username !== username.get) {
          router.push(paths.mypage(username.get));
        }
      })
      .finally(() => {
        isUploading.set(false);
        open.set(false);
      });
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
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/**프로필 에디터 */}
          {editImage.get ? (
            <></>
          ) : (
            <Stack spacing={1}>
              <Stack direction='row' alignItems='center'>
                <IconButton onClick={closeEditor}>
                  <Close />
                </IconButton>
                <Box flex={1}>
                  <Typography>Edit Profile</Typography>
                </Box>
                <Button
                  variant='contained'
                  sx={{ borderRadius: 5 }}
                  disabled={isUploading.get}
                  onClick={onPost}
                >
                  Save
                </Button>
              </Stack>
              {/**헤더 이미지 */}
              <Box position='relative' sx={{ width: '100%', aspectRatio: 3 }}>
                <img
                  src={newHeaderImage.get?.url || headerImage.get?.url}
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
                    disabled={!Boolean(newHeaderImage.get)}
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
                      src={newProfileImage.get?.url || profileImage.get?.url}
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
                label={`Username @${username.get}`}
                size='small'
                value={username.get}
                onChange={username.onTextChange}
              />
              <TextInput
                label='Bio'
                size='small'
                value={bio.get}
                onChange={bio.onTextChange}
                multiline
                minRows={3}
              />
              <HiddenInput
                type='file'
                accept='image/png, image/gif, image/jpeg'
                ref={profileRef}
                onChange={onImageChange(newProfileImage, 1)}
              />
              <HiddenInput
                type='file'
                accept='image/png, image/gif, image/jpeg'
                ref={headerRef}
                onChange={onImageChange(newHeaderImage, 3)}
              />
              <FormGroup>
                <FormControlLabel
                  label={'Protect'}
                  checked={is_protected.get}
                  value={is_protected.get}
                  onChange={(e, c) => is_protected.set(c)}
                  control={<Switch />}
                />
              </FormGroup>
            </Stack>
          )}
          {/**미디어 에디터 완성안됨*/}
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
                p={3}
                onMouseDown={(e) => {
                  dragStart.current = true;
                  prevPos.current = {
                    x: e.pageX,
                    y: e.pageY,
                  };
                }}
                onMouseUp={() => {
                  dragStart.current = false;
                }}
                onMouseLeave={() => {
                  dragStart.current = false;
                }}
                onMouseMove={(e) => {
                  if (!dragStart.current) return;
                  const newPos = {
                    x: prevPos.current.x - e.pageX,
                    y: prevPos.current.y - e.pageY,
                  };
                  translate.set((p) => ({
                    x: p.x - newPos.x,
                    y: p.y - newPos.y,
                  }));
                  console.log(newPos);
                  prevPos.current = {
                    x: e.pageX,
                    y: e.pageY,
                  };
                }}
              >
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  width='100%'
                  overflow='hidden'
                  sx={{ aspectRatio: 1 }}
                >
                  <Box
                    className='rectangle'
                    position='relative'
                    width='100%'
                    sx={{ aspectRatio: size.get.width / size.get.height }}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Box
                      position='absolute'
                      sx={{
                        transform: `translate3d(${translate.get.x}px, ${
                          translate.get.y
                        }px, ${0}px)`,
                      }}
                      zIndex={0}
                    >
                      <img
                        src={editImage.get.url}
                        draggable={false}
                        width='100%'
                        height='100%'
                        alt=''
                      />
                    </Box>
                    <Box
                      className='square'
                      width='100%'
                      height='100%'
                      maxWidth='100%'
                      maxHeight='100%'
                      display='flex'
                      justifyContent='center'
                    >
                      <Box
                        top={-2}
                        position='relative'
                        height='calc(100%)'
                        boxShadow='rgba(18, 21, 23, 0.7) 0px 0px 0px 9999px'
                        sx={{
                          aspectRatio: 1,
                          borderColor: theme.palette.info.main,
                          borderWidth: 4,
                          borderStyle: 'solid',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
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

const ProfileInfo: React.FC<{ profile: RegisteredUser }> = ({
  profile: _profile,
}) => {
  const router = useRouter();
  const [profile, user, { isMyProfile, setProfile, setMyProfile }] =
    useUserProfile(_profile);
  const profileEditorOpen = useValue(false);
  const { isSmall } = useMediaSize();
  const { done, wrapper } = usePromiseState();
  const followUser = () => {
    return (() => {
      if (profile.is_following_to) {
        return API.Relations.unfollowUser(profile.id);
      } else {
        return API.Relations.followUser(profile.id);
      }
    })().then(({ data }) => {
      API.Users.me()
        .then((r) => r.data)
        .then(setMyProfile);
      return API.Relations.getUserByUsername(profile.username)
        .then((r) => r.data)
        .then(setProfile);
    });
  };
  const onDirectMessage = (me: User) => {
    API.Messages.message
      .create({ users: [profile.id], is_direct_message: true })
      .then((r) => r.data)
      .then((r) => router.push(paths.groupMessage(r.id)));
  };

  const canCreateDm = useMemo(() => {
    if (!user) return false;
    if (isMyProfile) return false;
    if (profile.is_protected && !profile.is_mutual_follow) return false;
    return true;
  }, [user, profile]);

  if (!profile.is_registered) return <></>;
  return (
    <Box>
      {user ? <ProfileEditor open={profileEditorOpen} /> : <></>}
      {/**헤더 칸 */}
      {profile.header_image ? (
        <img
          src={profile.header_image.large || profile.header_image.url}
          alt=''
          style={{
            width: '100%',
            aspectRatio: 3,
            objectFit: 'cover',
            padding: 0,
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            aspectRatio: 3,
            bgcolor: 'text.disabled',
            p: 0,
            mb: 0.5,
          }}
        />
      )}
      {/**프로필 이미지 칸 */}
      <Stack
        direction='row'
        flexDirection='row'
        alignItems='center'
        position='relative'
        spacing={1}
        pb={3}
        px={0.5}
      >
        <Box />
        <Box
          sx={{
            height: isSmall ? '150%' : '200%',
            maxHeight: '200%',
            aspectRatio: '1',
            ml: 2,
            left: 0,
            position: 'absolute',
            top: isSmall ? '-90%' : '-120%',
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
              src={profile.profile_image?.medium || profile.profile_image?.url}
            />
          </Box>
        </Box>
        <Box flex={1} />
        {user && canCreateDm ? (
          <Box>
            <Tooltip title={`Direct Message with ${profile.nickname}`}>
              <IconButton
                sx={{
                  borderColor: 'textPrimary',
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
                onClick={() => onDirectMessage(user)}
                // size='small'
              >
                <Email />
              </IconButton>
            </Tooltip>
          </Box>
        ) : undefined}
        <Box>
          {!Boolean(user) ? (
            <Box m={1} height={32}></Box>
          ) : isMyProfile ? (
            <Button
              variant='outlined'
              color='inherit'
              onClick={() => profileEditorOpen.set(true)}
              sx={{ borderRadius: 15, m: 1 }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant='outlined'
              color={profile.is_following_to ? 'info' : 'inherit'}
              sx={{ borderRadius: 15 }}
              disabled={done.get === false}
              onClick={wrapper(followUser)}
            >
              {profile.is_following_to ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Box>
      </Stack>
      {/**프로필 정보 칸 */}
      <Stack px={2}>
        <Stack direction='row' alignItems='center'>
          <Typography variant='h5' fontWeight='bold'>
            {profile.nickname}
          </Typography>

          {profile.is_protected && (
            <Tooltip title="It's protected accounts">
              <Lock fontSize='small' />
            </Tooltip>
          )}
        </Stack>
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
            Registered at : {moment(profile.registered_at).format('YYYY:MM')}
          </Typography>
        </Stack>

        <ProfileFollowInfo profile={profile} />
      </Stack>
    </Box>
  );
};

export default ProfileInfo;
