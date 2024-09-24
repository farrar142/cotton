const paths = {
  home: '/',
  mypage: '/mypage',
  myinfo: '/mypage/info',
  myhistories: '/mypage/histories',
  mypoints: '/mypage/points',
  signin: '/auth/signin',
  signup: '/auth/signup',
  admin: '/admin',
  productDetail: (productId: number) => `/products/${productId}`,
};

export default paths;
