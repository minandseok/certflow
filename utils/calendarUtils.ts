import {StudyRecord} from '@/lib/dataService';
import {isSameDay, parseDate} from './dateUtils';

/**
 * 특정 회원의 공부한 날짜 목록을 추출
 */
export function getStudyDatesForMember(
  records: StudyRecord[],
  memberName: string
): Set<string> {
  const studyDates = new Set<string>();

  records.forEach((record) => {
    if (record.memberName === memberName) {
      studyDates.add(record.date);
    }
  });

  return studyDates;
}

/**
 * 특정 날짜의 모든 기록을 가져옴
 */
export function getRecordsForDate(
  records: StudyRecord[],
  date: Date
): StudyRecord[] {
  return records.filter((record) => {
    const recordDate = parseDate(record.date);
    return isSameDay(recordDate, date);
  });
}

/**
 * 특정 날짜와 회원의 기록을 가져옴
 */
export function getRecordsForDateAndMember(
  records: StudyRecord[],
  date: Date,
  memberName: string
): StudyRecord[] {
  return records.filter((record) => {
    const recordDate = parseDate(record.date);
    return isSameDay(recordDate, date) && record.memberName === memberName;
  });
}
