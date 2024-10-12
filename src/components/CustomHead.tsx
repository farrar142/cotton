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
      <meta
        name='viewport'
        content='width=device-width,height=device-height, initial-scale=1'
      />
      <meta
        name='google-site-verification'
        content='LA2XKy0Q8HJtdM5Lncd_U64En5WfhHogTczhz6ymGjk'
      />
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
        <meta
          name='viewport'
          content='width=device-width,height=device-height, initial-scale=1'
        />
        <meta
          name='google-site-verification'
          content='LA2XKy0Q8HJtdM5Lncd_U64En5WfhHogTczhz6ymGjk'
        />
        <title>Cotton</title>
      </Head>
    );
  if (!user) {
    return (
      <Head>
        <meta
          name='viewport'
          content='width=device-width,height=device-height, initial-scale=1'
        />
        <meta
          name='google-site-verification'
          content='LA2XKy0Q8HJtdM5Lncd_U64En5WfhHogTczhz6ymGjk'
        />
        <title>{`${meta.title} / Cotton`}</title>
        <RenderMeta meta={meta} />
      </Head>
    );
  }
  return <AuthenticatedHead meta={meta} user={user} />;
};
