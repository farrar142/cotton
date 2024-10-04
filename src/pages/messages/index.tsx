import { MessageGroupListViewer } from '#/components/layouts/pages/Messages/MessageGroupListViewer';
import { getLoginRequiredInitialPropsWrapper } from '#/functions/getInitialPropsWrapper';

/**
 * 1. 메세지 리스트들을 확인 할 수 있어야됨
 * 2. 매세지가 오면 업데이트가 되어야됨
 * 3. 그룹메세지,다이렉트 메세지를 분리해서 보여줘야됨
 */
const MessagesPage: ExtendedNextPage = ({ user }) => {
  if (!user) throw Error;
  return <MessageGroupListViewer me={user} />;
};

MessagesPage.getInitialProps = getLoginRequiredInitialPropsWrapper(
  async () => {}
);
export default MessagesPage;
