export function genHash(str: string) {
  // 해시 값 초기화
  let hash = 0;

  // 문자열이 비어 있으면 바로 0을 반환
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    // 문자열의 각 문자에 대해 UTF-16 코드 값을 가져옴
    const char = str.charCodeAt(i);

    // 해시 계산
    hash = (hash << 5) - hash + char;

    // 32비트 정수로 변환 (비트 연산을 통해)
    hash |= 0; // Convert to 32bit integer
  }

  // 양수 값으로 변환하여 반환
  return hash >>> 0;
}
