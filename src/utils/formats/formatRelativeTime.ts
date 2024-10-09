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
    return `${Math.floor(duration.asSeconds())} seconds ago`;
  } else if (duration.asMinutes() < 60) {
    return `${Math.floor(duration.asMinutes())} minutes ago`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())} hours ago`;
  } else if (duration.asMonths() < 1) {
    return `${Math.floor(duration.asDays())} days ago`;
  } else if (duration.asYears() < 1) {
    return `${Math.floor(duration.months())} months ago`;
  } else {
    return `${Math.floor(duration.years())} years ago`;
  }
};
