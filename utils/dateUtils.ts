/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 문자열 날짜를 Date 객체로 변환
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * 두 날짜가 같은 날인지 확인
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 특정 연도의 모든 날짜를 생성 (1월 1일 ~ 12월 31일)
 */
export function getAllDaysInYear(year: number): Date[] {
  const days: Date[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    days.push(new Date(date));
  }

  return days;
}

/**
 * 날짜가 특정 연도에 속하는지 확인
 */
export function isDateInYear(date: Date, year: number): boolean {
  return date.getFullYear() === year;
}

/**
 * 날짜의 요일을 반환 (0: 일요일, 6: 토요일)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * 날짜를 한국어 형식으로 포맷팅 (예: 2024년 1월 15일)
 */
export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}
