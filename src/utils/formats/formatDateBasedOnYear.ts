import moment from 'moment';

export const formatDateBasedOnYear = (isoString: string) => {
  const currentDate = moment();

  const inputDate = moment(isoString);

  if (inputDate.year() === currentDate.year()) {
    return inputDate.format('DD, MMM');
  } else {
    return inputDate.format('DD, MMM, YYYY');
  }
};
