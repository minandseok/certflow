'use client';

import {useState, useMemo, useEffect} from 'react';
import {StudyRecord, StudyDatabase} from '@/lib/dataService';
import {
  getAllDaysInYear,
  formatDate,
  formatDateKorean,
  getDayOfWeek,
  parseDate,
} from '@/utils/dateUtils';
import {
  getRecordsForDateAndMember,
  getStudyDatesForMember,
} from '@/utils/calendarUtils';

// GitHub 잔디 스타일 색상 (공부한 날)
const STUDY_COLOR = '#40c463'; // GitHub의 기본 잔디 색상
const NO_STUDY_COLOR = '#ebedf0'; // GitHub의 빈 날 색상

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];
const VALID_YEARS = [2026, 2027] as const;

export default function StudyCalendar() {
  const [members, setMembers] = useState<string[]>([]);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);
  const [tableYear, setTableYear] = useState(2026);
  const [tableMonth, setTableMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/study-data');
        const data: StudyDatabase = await response.json();
        setMembers(data.members);
        setRecords(data.records);
      } catch (error) {
        console.error('Failed to load study data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 선택된 회원의 공부한 날짜 목록
  const studyDates = useMemo(() => {
    if (!selectedMember) return new Set<string>();
    return getStudyDatesForMember(records, selectedMember);
  }, [selectedMember, records]);

  // 현재 연도의 모든 날짜
  const allDays = useMemo(() => {
    if (!VALID_YEARS.includes(currentYear as 2026 | 2027)) {
      return [];
    }
    return getAllDaysInYear(currentYear);
  }, [currentYear]);

  // 주 단위로 그룹화 (GitHub 잔디 스타일)
  const weeks = useMemo(() => {
    const weeksArray: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // 첫 날의 요일 계산
    const firstDay = allDays[0];
    const firstDayOfWeek = getDayOfWeek(firstDay);

    // 첫 주의 빈 칸 추가
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // 모든 날짜를 주 단위로 그룹화
    allDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // 마지막 주 처리
    if (currentWeek.length > 0) {
      // 마지막 주를 7일로 채우기
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArray.push(currentWeek);
    }

    return weeksArray;
  }, [allDays]);

  // 특정 날짜가 공부한 날인지 확인
  const isStudyDay = (date: Date): boolean => {
    if (!selectedMember) return false;
    const dateString = formatDate(date);
    return studyDates.has(dateString);
  };

  // 날짜가 2026년 1월 1일 이전인지 확인
  const isDateBefore2026 = (date: Date): boolean => {
    const startDate = new Date(2026, 0, 1, 0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < startDate;
  };

  // 날짜가 2027년 12월 31일 이후인지 확인
  const isDateAfter2027 = (date: Date): boolean => {
    const endDate = new Date(2027, 11, 31, 23, 59, 59, 999);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > endDate;
  };

  // 전체 공부 일 수 계산
  const totalStudyDays = useMemo(() => {
    if (!selectedMember) return 0;
    return studyDates.size;
  }, [selectedMember, studyDates]);

  // 전체 기록을 월별로 그룹화
  const recordsByMonth = useMemo(() => {
    const grouped: {[key: string]: StudyRecord[]} = {};
    records
      .filter((record) => {
        const recordDate = parseDate(record.date);
        return recordDate.getFullYear() === tableYear;
      })
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
      })
      .forEach((record) => {
        const recordDate = parseDate(record.date);
        const year = recordDate.getFullYear();
        const month = recordDate.getMonth();
        const key = `${year}-${month}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(record);
      });
    return grouped;
  }, [records, tableYear]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-40 text-gray-400'>
        데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div
      className='flex flex-col w-full max-w-7xl mx-auto p-6'
      onClick={() => {
        // 배경 클릭 시 모바일 툴팁 닫기
        setClickedDate(null);
      }}>
      {/* Time Tracker 링크 */}
      <div className='mb-4 text-right'>
        <a
          href='https://www.q-net.or.kr/crf021.do?id=crf02101&gSite=Q&gId=&scheType=01'
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-gray-600 hover:text-gray-800 transition-colors'>
          Q-Net 시험 일정
        </a>
      </div>

      {/* 회원별 공부 기록 */}
      <section
        className='border border-gray-300 rounded-lg p-6 mb-6'
        aria-labelledby='member-study-title'>
        <h2
          id='member-study-title'
          className='text-xl font-bold text-gray-800 mb-4'>
          회원별 공부 기록
        </h2>

        {/* 회원 목록 */}
        <div className='mb-6' role='group' aria-label='회원 선택'>
          <div className='flex flex-wrap gap-2'>
            {members.length === 0 ? (
              <p className='text-gray-500 italic text-sm'>
                등록된 회원이 없습니다.
              </p>
            ) : (
              members.map((member) => (
                <button
                  key={member}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember(
                      selectedMember === member ? null : member
                    );
                  }}
                  aria-pressed={selectedMember === member}
                  aria-label={`${member} 회원 선택`}
                  className={`member-button px-3 py-1.5 rounded-md border-2 transition-colors duration-200 text-sm ${
                    selectedMember === member
                      ? 'bg-white text-gray-900 border-gray-900 font-medium'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 font-medium'
                  }`}>
                  {member}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 연도 선택 */}
        <div
          className='year-controls mb-4 flex items-center gap-3'
          onClick={(e) => e.stopPropagation()}
          role='group'
          aria-label='연도 선택'>
          <button
            onClick={() => setCurrentYear(currentYear - 1)}
            disabled={currentYear <= 2026}
            aria-label='이전 연도'
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              currentYear <= 2026
                ? 'invisible pointer-events-none'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200'
            }`}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='w-5 h-5'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 19.5L8.25 12l7.5-7.5'
              />
            </svg>
          </button>
          <span
            className='text-xl font-semibold text-gray-800'
            aria-live='polite'>
            {currentYear}년
          </span>
          <button
            onClick={() => setCurrentYear(currentYear + 1)}
            disabled={currentYear >= 2027}
            aria-label='다음 연도'
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              currentYear >= 2027
                ? 'invisible pointer-events-none'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200'
            }`}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='w-5 h-5'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.25 4.5l7.5 7.5-7.5 7.5'
              />
            </svg>
          </button>
          {selectedMember && (
            <span className='ml-4 text-sm text-gray-600'>
              전체:{' '}
              <span className='font-semibold text-gray-800'>
                {totalStudyDays}일
              </span>
            </span>
          )}
        </div>

        {/* 캘린더 그리드 - GitHub 잔디 스타일 */}
        <div>
          {/* 주 단위로 그룹화된 날짜들 - 주는 세로로, 날짜는 가로로, 연결된 형태 */}
          <div className='flex gap-1 flex-wrap'>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className='flex flex-col gap-1'>
                {week.map((day, dayIndex) => {
                  // 빈 칸 처리
                  if (!day) {
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className='w-3 h-3 rounded-sm'
                      />
                    );
                  }

                  const dateString = formatDate(day);
                  const isBefore2026 = isDateBefore2026(day);
                  const isAfter2027 = isDateAfter2027(day);

                  // 2026년 이전 날짜와 2027년 이후 날짜는 표시하지 않음
                  if (isBefore2026 || isAfter2027) {
                    return (
                      <div
                        key={`hidden-${dateString}`}
                        className='w-3 h-3 rounded-sm'
                      />
                    );
                  }

                  const isStudied = isStudyDay(day);
                  const isHovered =
                    hoveredDate && formatDate(hoveredDate) === dateString;
                  const isClicked =
                    clickedDate && formatDate(clickedDate) === dateString;
                  const dayRecords = selectedMember
                    ? getRecordsForDateAndMember(records, day, selectedMember)
                    : [];

                  return (
                    <div
                      key={dateString}
                      className='relative group'
                      onMouseEnter={(e) => {
                        setHoveredDate(day);
                        setMousePosition({x: e.clientX, y: e.clientY});
                      }}
                      onMouseMove={(e) => {
                        setMousePosition({x: e.clientX, y: e.clientY});
                      }}
                      onMouseLeave={() => {
                        setHoveredDate(null);
                        setMousePosition(null);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isStudied && dayRecords.length > 0) {
                          if (isClicked) {
                            setClickedDate(null);
                          } else {
                            setClickedDate(day);
                          }
                        }
                      }}>
                      <div
                        className={`w-3 h-3 rounded-sm transition-all duration-200 ${
                          isStudied
                            ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-1'
                            : 'cursor-default'
                        } ${
                          isClicked ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                        }`}
                        style={{
                          backgroundColor: isStudied
                            ? STUDY_COLOR
                            : NO_STUDY_COLOR,
                        }}
                      />

                      {/* 호버 툴팁 - 데스크톱: 마우스 위쪽에 표시 */}
                      {isHovered &&
                        dayRecords &&
                        dayRecords.length > 0 &&
                        mousePosition &&
                        !isClicked && (
                          <div
                            className='hidden md:block fixed opacity-0 group-hover:opacity-100 transition-opacity z-9999 pointer-events-none whitespace-nowrap'
                            style={{
                              left: `${mousePosition.x}px`,
                              top: `${mousePosition.y - 10}px`,
                              transform: 'translate(-50%, -100%)',
                            }}>
                            <div className='bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded text-center shadow-lg'>
                              <div className='font-semibold mb-1'>
                                {formatDateKorean(day)}{' '}
                                {DAYS_OF_WEEK[getDayOfWeek(day)]}
                              </div>
                              {dayRecords.map((record, idx) => (
                                <div key={idx} className='text-left'>
                                  <div>자격증: {record.certificate}</div>
                                  <div>범위: {record.studyRange}</div>
                                  {idx < dayRecords.length - 1 && (
                                    <div className='border-t border-gray-600 my-1 mt-1' />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* 클릭 툴팁 - 모바일: 화면 하단에 고정 표시 */}
                      {isClicked && dayRecords && dayRecords.length > 0 && (
                        <div className='md:hidden fixed bottom-0 left-0 right-0 z-9999 p-4 bg-black bg-opacity-90 text-white text-sm shadow-lg'>
                          <div className='max-w-md mx-auto'>
                            <div className='flex justify-between items-center mb-2'>
                              <div className='font-semibold'>
                                {formatDateKorean(day)}{' '}
                                {DAYS_OF_WEEK[getDayOfWeek(day)]}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClickedDate(null);
                                }}
                                className='text-gray-300 hover:text-white'>
                                ✕
                              </button>
                            </div>
                            {dayRecords.map((record, idx) => (
                              <div key={idx} className='text-left mb-2'>
                                <div>자격증: {record.certificate}</div>
                                <div>범위: {record.studyRange}</div>
                                {idx < dayRecords.length - 1 && (
                                  <div className='border-t border-gray-600 my-2' />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 범례 */}
        <div
          className='mt-6 flex items-center gap-4 text-sm'
          role='group'
          aria-label='범례'>
          <div className='flex items-center gap-2'>
            <div
              className='w-4 h-4 rounded'
              style={{backgroundColor: NO_STUDY_COLOR}}
            />
            <span className='text-gray-600'>공부 안 함</span>
          </div>
          <div className='flex items-center gap-2'>
            <div
              className='w-4 h-4 rounded'
              style={{backgroundColor: STUDY_COLOR}}
            />
            <span className='text-gray-600'>공부함</span>
          </div>
        </div>
      </section>

      {/* 전체 월별 공부기록 */}
      <section
        className='border border-gray-300 rounded-lg p-6 mb-6'
        aria-labelledby='all-records-title'>
        <div className='flex items-center justify-between mb-4 flex-wrap gap-2'>
          <h2
            id='all-records-title'
            className='text-xl font-bold text-gray-800'>
            전체 월별 공부기록
          </h2>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>년:</span>
              <select
                value={tableYear}
                onChange={(e) => setTableYear(parseInt(e.target.value))}
                className='px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                {VALID_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>월:</span>
              <select
                value={tableMonth === null ? '' : tableMonth}
                onChange={(e) =>
                  setTableMonth(
                    e.target.value === '' ? null : parseInt(e.target.value)
                  )
                }
                className='px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                <option value=''>전체</option>
                {MONTH_NAMES.map((monthName, month) => (
                  <option key={month} value={month}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {(() => {
          let monthKeys = Object.keys(recordsByMonth).sort((a, b) => {
            // 최신순으로 정렬
            return b.localeCompare(a);
          });

          // 월 필터링
          if (tableMonth !== null) {
            monthKeys = monthKeys.filter((monthKey) => {
              const [, month] = monthKey.split('-').map(Number);
              return month === tableMonth;
            });
          }

          if (monthKeys.length === 0) {
            return (
              <div className='text-center py-8 text-sm text-gray-500'>
                {tableMonth !== null
                  ? `${tableYear}년 ${tableMonth + 1}월 기록이 없습니다.`
                  : `${tableYear}년 기록이 없습니다.`}
              </div>
            );
          }

          return monthKeys.map((monthKey) => {
            const [year, month] = monthKey.split('-').map(Number);
            const monthRecords = recordsByMonth[monthKey];

            return (
              <div key={monthKey} className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-700 mb-3'>
                  {year}년 {MONTH_NAMES[month]}
                </h3>
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-2 py-2 text-left text-xs font-semibold text-gray-700'>
                          날짜
                        </th>
                        <th className='px-2 py-2 text-left text-xs font-semibold text-gray-700'>
                          이름
                        </th>
                        <th className='px-2 py-2 text-left text-xs font-semibold text-gray-700'>
                          자격증
                        </th>
                        <th className='px-2 py-2 text-left text-xs font-semibold text-gray-700'>
                          범위
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthRecords.map((record, idx) => {
                        const recordDate = parseDate(record.date);
                        return (
                          <tr
                            key={idx}
                            className='hover:bg-gray-50 transition-colors'>
                            <td className='px-2 py-2 text-xs text-gray-700'>
                              {formatDateKorean(recordDate)}{' '}
                              {DAYS_OF_WEEK[getDayOfWeek(recordDate)]}
                            </td>
                            <td className='px-2 py-2 text-xs text-gray-700 font-medium'>
                              {record.memberName}
                            </td>
                            <td className='px-2 py-2 text-xs text-gray-700'>
                              {record.certificate}
                            </td>
                            <td className='px-2 py-2 text-xs text-gray-700'>
                              {record.studyRange}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          });
        })()}
      </section>
    </div>
  );
}
