export const formatCount = (num: number) => {
  if (num < 1 || !Number.isInteger(num)) {
    return '유효한 숫자가 아닙니다.';
  }

  if (num <= 999) {
    return num.toString(); // 1 ~ 999는 그대로 반환
  }

  // 천 이상의 경우
  if (num < 10000) {
    return `${Math.floor(num / 1000)}천`; // 천 단위 표현
  } else if (num < 100000000) {
    // 억 미만 (1만 ~ 9999만)
    return `${Math.floor(num / 10000)}만`; // 만 단위 표현
  } else if (num < 1000000000000) {
    // 조 미만 (1억 ~ 9999억)
    return `${Math.floor(num / 100000000)}억`; // 억 단위 표현
  } else {
    // 1조 이상
    return `${Math.floor(num / 1000000000000)}조`; // 조 단위 표현
  }
};
