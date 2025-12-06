import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '자격증 공부 기록 캘린더',
    template: '%s | 자격증 공부 기록',
  },
  description:
    '동아리 회원들의 자격증 공부 기록을 GitHub 잔디 그래프처럼 시각화하여 관리하는 캘린더입니다.',
  keywords: [
    '자격증',
    '공부',
    '캘린더',
    '학습 기록',
    '스터디',
    '동아리',
    '공부 관리',
  ],
  authors: [{name: 'CertFlow'}],
  creator: 'CertFlow',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://certflow.vercel.app',
    title: '자격증 공부 기록 캘린더',
    description:
      '동아리 회원들의 자격증 공부 기록을 GitHub 잔디 그래프처럼 시각화하여 관리하는 캘린더입니다.',
    siteName: 'CertFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: '자격증 공부 기록 캘린더',
    description:
      '동아리 회원들의 자격증 공부 기록을 GitHub 잔디 그래프처럼 시각화하여 관리하는 캘린더입니다.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
