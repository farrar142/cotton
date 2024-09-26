import useValue from '#/hooks/useValue';
import { ArrowBack, Close } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  Button,
  Dialog,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Tab,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import DraftEditor from '#/PostWriter/DraftEditor';
import API from '#/api';
import * as React from 'react';
import CommonLayout from '#/components/layouts/CommonLayout';
// import PostWriter from '#/PostWriter';
// const DraftEditor = dynamic(() => import('#/PostWriter/DraftEditor'), {
//   ssr: true,
// });

const Home = () => {
  const theme = useTheme();
  const tabValue = useValue('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    tabValue.set(newValue);
  };

  return (
    <CommonLayout>
      <Box>
        <TabContext value={tabValue.get}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              backdropFilter: 'blur(5px)',
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label='lab API tabs example'
              sx={{ button: { width: '50%' } }}
            >
              <Tab label='추천' value='1' />
              <Tab label='팔로우 중' value='2' />
            </TabList>
          </Box>
          <TabPanel value='1'>
            {/* <PostWriter /> */}
            <DraftEditor />
          </TabPanel>
          <TabPanel value='2'>Item Two</TabPanel>
        </TabContext>
      </Box>
    </CommonLayout>
  );
};
export default Home;

const lorem = `Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            architecto ad at eius iste quos ipsam cum consectetur? Iure in illo
            dolore eum maiores, repellendus vero ratione sequi asperiores ullam!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
            assumenda quia consequuntur. Quidem nobis facilis nisi, iusto nemo
            nihil earum optio quas in rerum nesciunt excepturi tenetur,
            doloremque, explicabo voluptas?`;
