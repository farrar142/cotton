/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true, // (optional)
  exclude: [
    '/messages', // 페이지 주소 하나만 제외시키는 경우
    '/messages/**', // 하위 주소 전체를 제외시키는 경우
  ], // sitemap 등록 제외 페이지 주소
  robotsTxtOptions: {
    // 정책 설정
    policies: [
      {
        userAgent: '*', // 모든 agent 허용
        allow: '/', // 모든 페이지 주소 크롤링 허용
        disallow: [
          '/exclude', // exclude로 시작하는 페이지 주소 크롤링 금지
        ],
      },
      // 추가 정책이 필요할 경우 배열 요소로 추가 작성
    ],
  }, // robots.txt 옵션 설정
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
};
