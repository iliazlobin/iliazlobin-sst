import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Personal website of Ilia Zlobin',
    short_name: 'Ilia Zlobin Website',
    description:
      'Personal website of Ilia Zlobin with blog, projects, recent anouncments and contact information',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
