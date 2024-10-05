import API from '#/api';
import { User } from '#/api/users/types';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import { useCursorPagination } from '#/hooks/paginations/useCursorPagination';
import { useRouter } from '#/hooks/useCRouter';
import { useObserver } from '#/hooks/useObserver';
import paths from '#/paths';
import { Stack, Box, SxProps, Theme } from '@mui/material';
import { useRef, useEffect } from 'react';
import { SystemStyleObject } from '@mui/system/styleFunctionSx';

export const UserSearchComponent: React.FC<{
  search: string;
  onClick?: (user: User) => void;
  itemStyle?: (theme: Theme) => SystemStyleObject<Theme>;
}> = ({ search, onClick, itemStyle }) => {
  const router = useRouter();
  const fetchBlockRef = useRef<HTMLElement>();
  const observer = useObserver();
  const { data: users, fetchNext } = useCursorPagination({
    getter: API.Users.users,
    params: { search },
    apiKey: 'userSearch',
  });

  useEffect(() => {
    const block = fetchBlockRef.current;
    if (!block) return;
    observer.onIntersection(fetchNext);
    observer.observe(block);
    return () => observer.unobserve(block);
  }, [search, users]);

  return (
    <Stack spacing={1}>
      {users.map((user) => (
        <SimpleProfileItem
          containerStyle={itemStyle}
          key={user.id}
          profile={user}
          onClick={() => onClick && onClick(user)}
        />
      ))}
      <Box ref={fetchBlockRef} />
    </Stack>
  );
};
