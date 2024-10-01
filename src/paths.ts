const paths = {
  home: '/',
  mypage: (username: string) => `/profiles/${username}`,
  postDetail: (id: number) => `/posts/${id}`,
  userfollowings: (username: string) => `/profiles/${username}/followings`,
  userfollowers: (username: string) => `/profiles/${username}/followers`,
};

export default paths;
