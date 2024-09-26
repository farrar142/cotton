import useValue from '#/hooks/useValue';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';

import * as React from 'react';
import SigninComponent from '../pages/SigninComponent';
import useUser from '#/hooks/useUser';
import LeftSidebar from './LeftSidebar';
import { useLoginWindow } from '#/hooks/useLoginWindow';

const CommonLayout: React.FC<{
  children?: React.ReactNode;
  openLoginWindow?: React.MutableRefObject<() => void>;
}> = ({ children }) => {
  const [_, setOpenLoginWindow] = useLoginWindow();
  const theme = useTheme();
  const [user] = useUser();
  const loginBackDrop = useValue(false);
  const media = useMediaQuery(theme.breakpoints.down('sm'));
  const handleLoginBackdrop = () => {
    loginBackDrop.set((p) => !p);
  };
  React.useEffect(() => {
    setOpenLoginWindow(() => () => handleLoginBackdrop());
  }, []);

  return (
    <Box
      display='flex'
      sx={{
        '>div:nth-of-type(2)': {
          maxWidth: theme.breakpoints.values.sm,
          width: '100%',
        },
        // height: '100%',
        // maxHeight: '100%',
      }}
    >
      <Box flex={1}>
        <Box
          position='sticky'
          height='100vh'
          minWidth={100}
          maxWidth={theme.breakpoints.values.xs / 2}
          top={0}
          left='100%'
        >
          <Box width='100%' pt={1}>
            <LeftSidebar />
          </Box>
          <Box
            position='absolute'
            minWidth={100}
            maxWidth={theme.breakpoints.values.xs / 2}
            width='100%'
            bottom={0}
            right={0}
            mb={3}
          >
            {user === undefined && (
              <Button
                variant='contained'
                fullWidth
                onClick={handleLoginBackdrop}
              >
                로그인
              </Button>
            )}
          </Box>
        </Box>
        <SigninComponent
          open={loginBackDrop.get}
          onClose={handleLoginBackdrop}
        />
      </Box>
      <Box position='relative'>{children}</Box>
      <Box flex={1} minWidth={100} display={media ? 'none' : 'block'}>
        <Box position='sticky' top={0}>
          오른쪽사이드바
        </Box>
      </Box>
    </Box>
  );
};
export default CommonLayout;
