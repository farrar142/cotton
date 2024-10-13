import 'react-notion/src/styles.css';
import { NotionRenderer } from 'react-notion';
import { Box } from '@mui/material';
import { useDarkMode } from '#/styles';
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

InstructionPage.getInitialProps = async () => {
  const data = await fetch(
    `https://notion-api.splitbee.io/v1/page/11d14ff5734480709083d5004e3e3062`
  ).then((d) => d.json());
  return {
    blockMap: data,
  };
};

export default InstructionPage;
