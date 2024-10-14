import 'react-notion/src/styles.css';
import { NotionRenderer } from 'react-notion';
import { Box } from '@mui/material';
import { useDarkMode } from '#/styles';
import API from '#/api';
import axios from 'axios';
const InstructionPage: ExtendedNextPage<{ blockMap: {} }> = ({ blockMap }) => {
  const [isDark] = useDarkMode();
  return (
    <Box
      color='inherit'
      sx={{
        '.notion': {
          color: isDark ? 'rgb(255, 255, 255)' : 'inherit',
        },
        '.notion-list-numbered>li': {
          // lineHeight: '1.02em',
        },
        '.notion-column>p': {
          lineHeight: '1.98em',
        },
        px: 2,
      }}
    >
      <NotionRenderer blockMap={blockMap} />
    </Box>
  );
};

InstructionPage.getInitialProps = async (ctx) => {
  const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
  const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
  const WEBHOOK = process.env.DISCORD_WEBHOOK;
  let tokens = undefined;
  if (TEST_USER_EMAIL && TEST_USER_PASSWORD) {
    tokens = await API.Auth.signin({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    }).then((r) => r.data);
    if (WEBHOOK) {
      axios.post(WEBHOOK, {
        content: 'User Login',
      });
    }
  }
  const data = await fetch(
    `https://notion-api.splitbee.io/v1/page/11d14ff5734480709083d5004e3e3062`
  ).then((d) => d.json());
  return {
    blockMap: data,
    tokens,
  };
};

export default InstructionPage;
