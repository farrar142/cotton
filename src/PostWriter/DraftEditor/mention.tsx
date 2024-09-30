import { User } from '#/api/users/types';
import { MentionPluginTheme, MentionData } from '@draft-js-plugins/mention';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import { Box, Typography, useTheme } from '@mui/material';
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
      bgcolor='transparent'
      //   className={theme?.mentionSuggestions}
      sx={{
        bgcolor: isFocused ? 'var(--mention-selected)' : 'inherit',
        // borderColor: _theme.palette.info.light,
        // borderWidth: '1px',
        // borderStyle: 'solid',
        pb: 0.5,
      }}
    >
      <Typography
        component='span'
        data-type='mention'
        data-username={mention.username}
        data-id={mention.id}
        className='mention'
        sx={{ color: 'primary.main' }}
      >
        @{mention.username}
      </Typography>
    </Box>
  );
};

export const MentionComponent: React.FC<SubMentionComponentProps> = (e) => {
  //@ts-ignore
  const key = e.children[0].key;
  const theme = useTheme();
  return (
    <span
      className={e.className}
      spellCheck={false}
      data-testid='mentionText'
      style={{ cursor: 'pointer', color: theme.palette.primary.main }}
      onClick={() => {
        console.log(e.mention);
      }}
    >
      <span data-offset-key={key}>
        <span data-text={true}>@{e.mention.username}</span>
      </span>
    </span>
  );
};
export const userToMentonData = (user: User): MentionData => ({
  ...user,
  name: user.username,
});
