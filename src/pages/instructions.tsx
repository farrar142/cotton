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
        px: 2,
      }}
    >
      <NotionRenderer blockMap={blockMap} />
    </Box>
  );
};

export const getStaticProps = async () => {
  const data = await fetch(
    `https://notion-api.splitbee.io/v1/page/11d14ff5734480709083d5004e3e3062`
  ).then((d) => d.json());
  return {
    props: {
      blockMap: data,
    },
  };
};

export default InstructionPage;
