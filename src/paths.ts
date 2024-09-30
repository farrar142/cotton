const paths = {
  home: '/',
  mypage: (username: string) => `/profiles/${username}`,
  postDetail: (id: number) => `/posts/${id}`,
};

export default paths;
