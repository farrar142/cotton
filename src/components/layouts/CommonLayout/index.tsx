import useValue from '#/hooks/useValue';
import { Avatar, Box, IconButton, styled, useTheme } from '@mui/material';

import NextLink from '#/components/NextLink';
import { useRouter } from '#/hooks/useCRouter';
import { useLoginWindow } from '#/hooks/useLoginWindow';
import useMediaSize from '#/hooks/useMediaSize';
import useUser from '#/hooks/useUser';
import paths from '#/paths';
import { glassmorphism } from '#/styles';
import { Cloud, ExitToApp, Replay } from '@mui/icons-material';
import React, { useEffect, useMemo } from 'react';
import SigninComponent from '../pages/SigninComponent';
import { ElevatedPostWriter } from './ElevatedPostWriter';
import LeftSidebar from './LeftSidebar';

const CommonLayout: React.FC<{
  children?: React.ReactNode;
  openLoginWindow?: React.MutableRefObject<() => void>;
}> = ({ children }) => {
  const [_, setOpenLoginWindow] = useLoginWindow();
  const theme = useTheme();
  const loginBackDrop = useValue(false);
  const { isMd, isSmall } = useMediaSize();
  const handleLoginBackdrop = () => {
    loginBackDrop.set((p) => !p);
  };
  useEffect(() => {
    setOpenLoginWindow(() => () => handleLoginBackdrop());
  }, []);

  const SideFlexBox = useMemo(
    () => styled(Box)({ flex: 1, minWidth: isSmall ? 0 : isMd ? 80 : 120 }),
    [isMd, isSmall]
  );

  return (
    <Box
      display='flex'
      sx={{
        '>div:nth-of-type(2)': {
          maxWidth: isMd
            ? theme.breakpoints.values.md
            : theme.breakpoints.values.sm,
          width: '100%',
        },
      }}
    >
      <SideFlexBox>
        <Box
          sx={[
            isSmall
              ? {
                  position: 'fixed',
                  bottom: 0,
                  zIndex: 5,
                  width: '100vw',
                  ...glassmorphism(theme),
                }
              : {
                  position: 'sticky',
                  height: '100vh',
                  minWidth: 80,
                  top: 0,
                  left: '100%',
                },
            isMd ? {} : {},
          ]}
        >
          <Box
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            justifyContent='space-between'
            height='100%'
            pt={isSmall ? undefined : 1}
            py={isSmall ? 0.5 : undefined}
            pr={isSmall ? undefined : 2}
          >
            <LeftSidebar openLoginWindow={handleLoginBackdrop} />
          </Box>
        </Box>
        <SigninComponent
          open={loginBackDrop.get}
          onClose={() => loginBackDrop.set(false)}
        />
      </SideFlexBox>
      <Box position='relative'>
        <SmallSizeHeader
          handleLoginBackdrop={handleLoginBackdrop}
          isSmall={isSmall}
        />
        <Box
          position='relative'
          maxWidth={isSmall ? '100vw' : undefined}
          minHeight='100vh'
          sx={{
            '>*': { pb: 10 },
            borderWidth: '1px',
            borderColor: theme.palette.divider,
            borderStyle: 'solid',
          }}
        >
          {children}
        </Box>
      </Box>
      <SideFlexBox display={isMd ? 'none' : 'block'}>
        <Box position='sticky' top={0}></Box>
      </SideFlexBox>
      <ElevatedPostWriter />
    </Box>
  );
};

const SmallSizeHeader: React.FC<{
  handleLoginBackdrop: () => void;
  isSmall: boolean;
}> = ({ handleLoginBackdrop, isSmall }) => {
  const [user, _, signout] = useUser();
  const router = useRouter();
  if (!isSmall) return <></>;
  return (
    <Box
      top={0}
      width='100%'
      display='flex'
      justifyContent='space-around'
      alignItems='center'
    >
      <IconButton
        onClick={
          user
            ? () => router.push(paths.mypage(user.username))
            : handleLoginBackdrop
        }
      >
        <Avatar src={user?.profile_image?.small} />
      </IconButton>
      <NextLink href={paths.home}>
        <IconButton size='large'>
          <Cloud fontSize='large' />
        </IconButton>
      </NextLink>
      {user ? (
        <IconButton onClick={signout} color='warning'>
          <ExitToApp />
        </IconButton>
      ) : (
        <IconButton onClick={router.reload}>
          <Replay />
        </IconButton>
      )}
    </Box>
  );
};
export default CommonLayout;
