import {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '자격증 공부 기록 캘린더',
    short_name: 'CertFlow',
    description:
      '동아리 회원들의 자격증 공부 기록을 GitHub 잔디 그래프처럼 시각화하여 관리하는 캘린더',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
