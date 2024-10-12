import { User } from '#/api/users/types';
import Head from 'next/head';
import { useUnCheckedNotification } from './layouts/pages/Notifications/NotificationAtom';
import { useUnreadedMessagesCount } from './layouts/pages/Messages/MessageGroupAtom';
import useUser from '#/hooks/useUser';

const RenderMeta: React.FC<{ meta: Meta }> = ({ meta }) => {
  return <></>;
};

const AuthenticatedHead: React.FC<{ meta: Meta; user: User }> = ({
  meta,
  user,
}) => {
  const notifications = useUnCheckedNotification(user);
  const messages = useUnreadedMessagesCount(user);
  const totalNew = notifications.count + messages.count;
  return (
    <Head>
      <title>{`${meta.title} / Cotton ${
        totalNew ? `(${totalNew})` : ''
      }`}</title>
      <RenderMeta meta={meta} />
    </Head>
  );
};

export const CustomHead: React.FC<{ meta?: Meta }> = ({ meta }) => {
  const [user] = useUser();
  if (!meta)
    return (
      <Head>
        <title>Cotton</title>
      </Head>
    );
  if (!user) {
    return (
      <Head>
        <title>{`${meta.title} / Cotton`}</title>
        <RenderMeta meta={meta} />
      </Head>
    );
  }
  return <AuthenticatedHead meta={meta} user={user} />;
};
