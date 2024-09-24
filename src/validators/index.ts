export const validateEmail = (email?: string) => {
  const match = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (match === null) return '옳바른 이메일을 입력해주세요';
  return false;
};

export const validatePassword = (value: string) => {
  if (value.length < 9) return '비밀번호는 9자리 이상이어야 합니다.';
  return;
};

export const validatePassword2 = (value: string, value2: string) => {
  if (value !== value2) return '비밀번호가 일치하지 않습니다';
  return;
};
