import NextLink from '#/components/NextLink';
import { useFetchedProfile } from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import { borderGlowing } from '#/styles';
import { Box, Popper, Fade, Stack, Avatar, Typography } from '@mui/material';
import { ReactNode, useId, useRef, useEffect, MouseEvent } from 'react';
import { ProfileFollowInfo } from './ProfileFollowInfo';
import React from 'react';

export const ProfilePopper: React.FC<{
  profileId: number | string;
  children: ReactNode;
  component?: React.ElementType;
  isFlex?: boolean;
}> = ({ profileId, children, component = 'span', isFlex = true }) => {
  const id = useId();
  const [profile, fetchUser] = useFetchedProfile(profileId);
  const anchorRef = useRef<HTMLElement>();
  const anchorEl = useValue<HTMLElement | null>(null);
  const open = Boolean(anchorEl.get) && Boolean(profile);
  const onMouseEnter = useValue(false);
  const popOverEntered = useRef(false);

  const remain = useValue<'closed' | 'pending' | 'remain'>('closed');

  const handleMouseOver = () => {
    if (anchorEl.get) return;
    if (!anchorRef.current) return;
    fetchUser();
    anchorEl.set(anchorRef.current);
    onMouseEnter.set(true);
    popOverEntered.current = false;
  };
  const handleClose = () => {
    anchorEl.set(null);
    onMouseEnter.set(false);
    popOverEntered.current = false;
  };

  //check mouse still positioned
  useEffect(() => {
    if (!onMouseEnter.get) return;
    remain.set('pending');
    const timeout = setTimeout(() => {
      remain.set('remain');
      handleMouseOver();
    }, 500);
    return () => {
      clearTimeout(timeout);
      remain.set('closed');
    };
  }, [onMouseEnter.get]);
  //check mouse exited
  useEffect(() => {
    if (onMouseEnter.get) return;
    const timeout = setTimeout(() => {
      if (popOverEntered.current) return;
      handleClose();
    }, 100);
    return () => clearTimeout(timeout);
  }, [onMouseEnter.get]);
  return (
    <>
      <Box
        component={component}
        onMouseEnter={() => onMouseEnter.set(true)}
        onMouseLeave={() => {
          onMouseEnter.set(false);
        }}
        ref={anchorRef}
        sx={
          isFlex
            ? {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }
            : {}
        }
      >
        {children}
      </Box>
      <Popper
        id={id}
        anchorEl={anchorEl.get}
        open={open}
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={() => onMouseEnter.set(false)}
        onMouseEnter={() => {
          popOverEntered.current = true;
        }}
        transition
        sx={{ zIndex: 10 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350} style={{ zIndex: 1000 }}>
            {profile ? (
              <Stack
                bgcolor='Background'
                sx={(theme) => borderGlowing(theme)}
                onMouseLeave={handleClose}
                borderRadius={5}
                p={2}
                maxWidth={(theme) => theme.breakpoints.values.xs}
                spacing={2}
              >
                <NextLink href={paths.mypage(profile.username)}>
                  <Stack spacing={2}>
                    <Avatar
                      src={
                        profile.profile_image?.small ||
                        profile.profile_image?.url
                      }
                    />
                    <Stack>
                      <Typography
                        variant='h5'
                        color='textPrimary'
                        sx={{
                          ':hover': {
                            textDecoration: 'underline',
                            textDecorationColor: 'text.primary',
                          },
                        }}
                      >
                        {profile.nickname}
                      </Typography>
                      <Typography variant='subtitle2' color='textDisabled'>
                        @{profile.username}
                      </Typography>
                    </Stack>
                  </Stack>
                </NextLink>
                <Typography>{profile.bio}</Typography>
                <ProfileFollowInfo profile={profile} />
              </Stack>
            ) : (
              <></>
            )}
          </Fade>
        )}
      </Popper>
    </>
  );
};
