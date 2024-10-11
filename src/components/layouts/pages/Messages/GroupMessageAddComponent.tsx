import API from '#/api';
import TextInput from '#/components/inputs/TextInput';
import { useRouter } from '#/hooks/useCRouter';
import { usePromiseState } from '#/hooks/usePromiseState';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import { glassmorphism } from '#/styles';
import { Close, Search } from '@mui/icons-material';
import {
  Dialog,
  Stack,
  IconButton,
  Typography,
  Box,
  Button,
  InputAdornment,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { UserSearchComponent } from '../../users/UserSearchComponent';
import { User } from '#/api/users/types';

export const GroupMessageAddComponent: React.FC<{
  open: boolean;
  onClose: () => void;
  me: User;
  onPost: (users: User[]) => Promise<any>;
  title?: string;
  postButtonName?: string;
  exclude_ids?: string;
}> = ({
  open,
  onClose,
  me,
  onPost,
  title = 'New Message',
  postButtonName = 'Create',
  exclude_ids,
}) => {
  const router = useRouter();
  const search = useValue('');
  const selectedUsers = useValue<User[]>([]);
  const { done, wrapper } = usePromiseState();

  const onCreate = wrapper(() => onPost(selectedUsers.get));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={glassmorphism}
      PaperProps={{
        sx: (theme) => ({ ...glassmorphism(theme), borderRadius: 5, py: 2 }),
        variant: 'outlined',
      }}
    >
      <Stack
        width='100%'
        maxWidth={(theme) => theme.breakpoints.values.xs * 1.5}
        minHeight={(theme) => theme.breakpoints.values.sm}
      >
        <Stack direction='row' alignItems='center' px={1}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
          <Typography variant='h6'>{title}</Typography>
          <Box flex={1} />
          <Button
            variant='contained'
            size='small'
            sx={{ mr: 1 }}
            disabled={selectedUsers.get.length === 0 || !done}
            onClick={onCreate}
          >
            {postButtonName}
          </Button>
        </Stack>
        <Box px={2} py={1}>
          <TextInput
            placeholder='Search User'
            name='username'
            value={search.get}
            onChange={search.onTextChange}
            size='small'
            variant='standard'
            fullWidth
            slotProps={{
              input: {
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Divider />
        <Box
          display='inline-block'
          flexDirection='row'
          minHeight={48}
          alignItems='center'
          maxWidth='100%'
          pt={1}
          px={1}
        >
          {selectedUsers.get.map((user) => (
            <Chip
              key={user.id}
              label={user.nickname}
              avatar={
                <Avatar
                  src={user.profile_image?.small || user.profile_image?.url}
                />
              }
              sx={{ mb: 1, mr: 1 }}
              onDelete={() =>
                selectedUsers.set((p) => p.filter((u) => u.id !== user.id))
              }
            />
          ))}
        </Box>
        <Divider />
        <UserSearchComponent
          search={search.get}
          id__in={exclude_ids || me.id.toString()}
          itemStyle={(theme) => ({ px: 1, py: 0.5 })}
          onClick={(user) => {
            selectedUsers.set((p) => {
              if (p.find((u) => u.id == user.id)) {
                return p.filter((u) => u.id !== user.id);
              }
              return [...p, user];
            });
          }}
        />
      </Stack>
    </Dialog>
  );
};
