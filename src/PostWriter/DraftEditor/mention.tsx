import { User } from '#/api/users/types';
import { ProfileFollowInfo } from '#/components/layouts/pages/ProfilePage/ProfileFollowInfo';
import { ProfilePopper } from '#/components/layouts/pages/ProfilePage/ProfilePopper';
import NextLink from '#/components/NextLink';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import { useFetchedProfile, useUserProfile } from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import { borderGlowing, glassmorphism } from '#/styles';
import { MentionPluginTheme, MentionData } from '@draft-js-plugins/mention';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';
import {
  Avatar,
  Box,
  BoxProps,
  Fade,
  Menu,
  MenuItem,
  Popover,
  Popper,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ReactNode, useEffect, useRef } from 'react';
import { MouseEvent, MouseEventHandler, useId } from 'react';

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
    <ProfilePopper profileId={e.mention.id || 0}>
      <span>
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
            zIndex: 2,
          }}
        >
          <span data-offset-key={key}>
            <span data-text={true}>@{e.mention.username}</span>
          </span>
        </StyledSpan>
      </span>
    </ProfilePopper>
  );
};
export const userToMentonData = (user: User): MentionData => ({
  ...user,
  name: user.username,
});
