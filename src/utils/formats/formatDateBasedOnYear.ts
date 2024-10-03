import moment from 'moment';

export const formatDateBasedOnYear = (isoString: string) => {
  const currentDate = moment();

  const inputDate = moment(isoString);

  if (inputDate.year() === currentDate.year()) {
    return inputDate.format('MM월 DD일');
  } else {
    return inputDate.format('YYYY년 MM월 DD일');
  }
};
