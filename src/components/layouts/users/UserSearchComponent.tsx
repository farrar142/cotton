import API from '#/api';
import { User } from '#/api/users/types';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import { useCursorPagination } from '#/hooks/paginations/useCursorPagination';
import { useRouter } from '#/hooks/useCRouter';
import { useObserver } from '#/hooks/useObserver';
import paths from '#/paths';
import { Stack, Box } from '@mui/material';
import { useRef, useEffect } from 'react';

export const UserSearchComponent: React.FC<{
  search: string;
  onClick?: (user: User) => void;
}> = ({ search, onClick }) => {
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
          key={user.id}
          profile={user}
          onClick={() => onClick && onClick(user)}
        />
      ))}
      <Box ref={fetchBlockRef} />
    </Stack>
  );
};
