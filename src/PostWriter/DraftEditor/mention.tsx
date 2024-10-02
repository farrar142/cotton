import { User } from '#/api/users/types';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import { MentionPluginTheme, MentionData } from '@draft-js-plugins/mention';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import { Box, styled, Typography, useTheme } from '@mui/material';
import { MouseEventHandler } from 'react';

export interface EntryComponentProps {
  className?: string;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseUp: MouseEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  role: string;
  id: string;
  'aria-selected'?: boolean | 'false' | 'true';
  theme?: MentionPluginTheme;
  mention: MentionData;
  isFocused: boolean;
  searchValue?: string;
}

export const MentionEntry: React.FC<EntryComponentProps> = (props) => {
  const {
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props;
  const _theme = useTheme();
  return (
    <Box
      id={props.id}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onClick={onMouseDown}
      sx={{ minWidth: '300px', width: '100%' }}
    >
      {/**@ts-ignore */}
      <SimpleProfileItem profile={mention} />
    </Box>
  );
};

const StyledSpan = styled('span')({});

export const MentionComponent: React.FC<{
  children?: SubMentionComponentProps['children'];
  mention: SubMentionComponentProps['mention'];
  className?: string;
}> = (e) => {
  //@ts-ignore
  const key = [...(e.children || []), { key: 'none' }][0].key;
  const theme = useTheme();
  return (
    <StyledSpan
      // className={e.className}
      spellCheck={false}
      data-testid='mentionText'
      color='primary'
      sx={{
        cursor: 'pointer',
        color: theme.palette.primary.main,
        ':hover': {
          textDecoration: 'underline',
        },
      }}
      onClick={() => {
        console.log(e.mention);
      }}
    >
      <span data-offset-key={key}>
        <span data-text={true}>@{e.mention.username}</span>
      </span>
    </StyledSpan>
  );
};
export const userToMentonData = (user: User): MentionData => ({
  ...user,
  name: user.username,
});
