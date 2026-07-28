import 'react-perfect-scrollbar/dist/css/styles.css'
import './globals.css'
import 'remixicon/fonts/remixicon.css';

import Providers from '@components/Providers'

export const metadata = {
  title: 'Rathana Template',
  description: 'Develop next-level web apps with Rathana Template - NextJS Admin Dashboard Template. Now, updated with lightning-fast routing powered by MUI and App router.'
}

const RootLayout = ({ children }) => {
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout


