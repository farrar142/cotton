import moment from 'moment';

export const formatRelativeTime = (inputTime: string) => {
  // 현재 시각
  const now = moment();

  // 입력된 시간
  const givenTime = moment(inputTime);

  // 두 시간의 차이를 계산
  const duration = moment.duration(now.diff(givenTime));

  // 차이에 따른 포맷 결정
  if (duration.asSeconds() < 60) {
    return `${Math.floor(duration.asSeconds())}초 전`;
  } else if (duration.asMinutes() < 60) {
    return `${Math.floor(duration.asMinutes())}분 전`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())}시간 전`;
  } else {
    return `${Math.floor(duration.asDays())}일 전`;
  }
};
