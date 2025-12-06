import {readFileSync} from 'fs';
import {join} from 'path';

/**
 * 공부 기록 데이터 타입
 */
export interface StudyRecord {
  date: string; // YYYY-MM-DD 형식
  memberName: string;
  certificate: string;
  studyRange: string;
}

/**
 * 데이터베이스 타입
 */
export interface StudyDatabase {
  members: string[];
  records: StudyRecord[];
}

/**
 * 데이터베이스 데이터 가져오기 (서버 사이드 전용)
 */
export function getStudyDatabase(): StudyDatabase {
  try {
    const filePath = join(process.cwd(), 'data', 'studyRecords.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as StudyDatabase;
  } catch (error) {
    // 파일이 없거나 읽을 수 없는 경우 기본값 반환
    return {members: [], records: []};
  }
}

/**
 * 모든 회원 목록 가져오기 (서버 사이드 전용)
 */
export function getMembers(): string[] {
  const database = getStudyDatabase();
  return database.members;
}

/**
 * 모든 기록 가져오기 (서버 사이드 전용)
 */
export function getRecords(): StudyRecord[] {
  const database = getStudyDatabase();
  return database.records;
}
