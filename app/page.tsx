import StudyCalendar from '@/components/StudyCalendar';

export default function Home() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '자격증 공부 기록 캘린더',
            description:
              '동아리 회원들의 자격증 공부 기록을 GitHub 잔디 그래프처럼 시각화하여 관리하는 캘린더입니다.',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'KRW',
            },
          }),
        }}
      />
      <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans'>
        <main className='flex min-h-screen w-full flex-col py-8 px-4 bg-white'>
          <StudyCalendar />
        </main>
      </div>
    </>
  );
}
