const paths = {
  home: '/',
  mypage: (username: string) => `/${username}`,
  postDetail: (id: number) => `/posts/${id}`,
};

export default paths;
