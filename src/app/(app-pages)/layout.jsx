import Providers from '@/components/Providers'
import LocalizationProviderWrapper from '@/components/LocalizationProviderWrapper'
import AuthLayoutSwitcher from '@components/AuthLayoutSwitcher'

const AppLayout = async ({ children }) => {
  return (
    <LocalizationProviderWrapper>
      <Providers>
        <AuthLayoutSwitcher>{children}</AuthLayoutSwitcher>
      </Providers>
    </LocalizationProviderWrapper>
  )
}

export default AppLayout
